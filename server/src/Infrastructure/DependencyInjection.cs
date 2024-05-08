using System.Text;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Emails;
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
        services.AddScoped(_ => new ApplicationContext(
            config.GetConnectionString("Default")!,
            isDevelopment
        ));

        services.AddMessageBus(config);
        services.AddJwtAuthentication(config);
    }

    private static void AddMessageBus(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<EmailSettings>(config.GetSection(nameof(EmailSettings)));
        services.PostConfigure<EmailSettings>(settings =>
        {
            settings.Password = Environment.GetEnvironmentVariable("OUTLOOK_PASSWORD")!;
        });
        
        services.AddTransient<MessageBus>();
    }

    private static void AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddTransient<JwtService>();

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
                            CookieTokens.Access.Name,
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
    }
}
