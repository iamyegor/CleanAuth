using System.Text;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Sms;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration config,
        bool isDevelopment
    )
    {
        services
            .AddScoped(_ => new ApplicationContext(
                config.GetConnectionString("Default")!,
                isDevelopment
            ))
            .AddEmailMesssages(config)
            .AddJwtAuthentication(config)
            .AddAuthorization()
            .AddDapper()
            .AddSmsMessages();
    }

    private static IServiceCollection AddEmailMesssages(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.Configure<EmailSettings>(config.GetSection(nameof(EmailSettings)));
        services.PostConfigure<EmailSettings>(settings =>
        {
            settings.Password = Environment.GetEnvironmentVariable("OUTLOOK_PASSWORD")!;
        });

        services.AddTransient<IDomainEmailSender, DomainEmailSender>();
        services.AddTransient<EmailMessageBus>();

        return services;
    }

    private static IServiceCollection AddAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(config =>
        {
            config.AddPolicy(
                PoliciyNames.EmailVerified,
                p => p.RequireClaim(JwtClaims.IsEmailVerified, "true")
            );

            config.AddPolicy(
                PoliciyNames.PhoneNumberNotVerified,
                p =>
                {
                    p.RequireClaim(JwtClaims.IsPhoneNumberVerified, "false");
                }
            );

            config.AddPolicy(
                PoliciyNames.EmailNotVerified,
                p =>
                {
                    p.RequireClaim(JwtClaims.IsEmailVerified, "false");
                }
            );

            config.AddPolicy(
                PoliciyNames.AccountAuthenticated,
                p =>
                {
                    p.RequireClaim(JwtClaims.IsEmailVerified, "true");
                    p.RequireClaim(JwtClaims.IsPhoneNumberVerified, "true");
                }
            );
        });

        return services;
    }

    private static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddTransient<JwtService>();
        services.AddTransient<JwtClaims>();

        services.Configure<JwtSettings>(config.GetSection(nameof(JwtSettings)));

        IConfigurationSection jwtSettingsSection = config.GetSection(nameof(JwtSettings));
        JwtSettings jwtSettings = jwtSettingsSection.Get<JwtSettings>()!;

        string secret = Environment.GetEnvironmentVariable("SECRET")!;

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents()
                {
                    OnMessageReceived = context =>
                    {
                        bool containsCookie = context.Request.Cookies.TryGetValue(
                            Cookies.AccessToken.Name,
                            out var accesToken
                        );

                        if (containsCookie)
                        {
                            context.Token = accesToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        return services;
    }

    private static IServiceCollection AddDapper(this IServiceCollection services)
    {
        services.AddTransient<DapperConnectionFactory>();

        return services;
    }

    private static IServiceCollection AddSmsMessages(this IServiceCollection services)
    {
        services.AddTransient<ISmsMessageBus, SmsMessageBus>();
        services.AddTransient<VerificationCodeSender>();

        return services;
    }
}
