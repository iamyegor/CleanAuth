using Api.Infrastructure;
using Api.Mappings;
using Infrastructure.Data;
using Serilog;

namespace Api;

public static class DependencyInjection
{
    public static void AddApiServices(this IServiceCollection services, string corsPolicy)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddCors(corsPolicy);
        services.RegisterMappings();
    }

    private static void AddCors(this IServiceCollection services, string corsPolicy)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                corsPolicy,
                policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173", "http://localhost")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }
            );
        });
    }

    public static void AddSerilog(this ConfigureHostBuilder host)
    {
        host.UseSerilog((context, config) => config.ReadFrom.Configuration(context.Configuration));
    }
}
