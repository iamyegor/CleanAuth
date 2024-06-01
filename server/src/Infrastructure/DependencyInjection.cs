using Infrastructure.Authentication;
using Infrastructure.Authorization;
using Infrastructure.Cookies;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Sms;
using Infrastructure.SocialAuthentication;
using Infrastructure.TokensValidators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
            .AddAuthentication(config)
            .AddAuthorization()
            .AddDapper()
            .AddSmsMessages()
            .AddSocialTokenManagers()
            .AddUtils();
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
        services.AddAuthorization(AuthorizationPolicies.AddPolicies);

        return services;
    }

    private static IServiceCollection AddAuthentication(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddTransient<TokensGenerator>();
        services.AddTransient<JwtClaims>();
        services.AddTransient<JwtValidationParameters>();
        services.Configure<JwtSettings>(config.GetSection(nameof(JwtSettings)));

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                ServiceProvider serviceProvider = services.BuildServiceProvider();
                var validationParameters =
                    serviceProvider.GetRequiredService<JwtValidationParameters>();

                options.TokenValidationParameters = validationParameters.GetParameters();
                options.Events = BearerEvents.ExtractTokenFromCookieEvent();
            })
            .AddGoogle(options =>
            {
                options.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")!;
                options.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")!;
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
        services.AddTransient<DomainSmsSender>();

        return services;
    }

    private static IServiceCollection AddSocialTokenManagers(this IServiceCollection services)
    {
        services.AddTransient<VkTokenManager>();
        services.AddTransient<OdnoklassnikiTokenManager>();

        return services;
    }

    private static IServiceCollection AddUtils(this IServiceCollection services)
    {
        services.AddTransient<UserTokensUpdater>();
        services.AddTransient<IGoogleIdTokenValidator, GoogleIdTokenValidator>();
        services.AddTransient<CookiesInfoExtractor>();
        services.AddTransient<HttpClient>();

        return services;
    }
}
