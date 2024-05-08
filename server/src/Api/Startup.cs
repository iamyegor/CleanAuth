using Api.Infrastructure;
using Application;
using Infrastructure;

namespace Api;

public static class Startup
{
    private const string CorsPolicy = "myCorsPolicy";

    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Host.AddSerilog();
        builder.Services.AddApiServices(CorsPolicy);
        builder.Services.AddInfrastructureServices(
            builder.Configuration,
            builder.Environment.IsDevelopment()
        );
        builder.Services.AddApplicationServices();

        return builder.Build();
    }

    public static WebApplication ConfigureMiddlewares(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(CorsPolicy);
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseHttpsRedirection();
        app.MapControllers();

        return app;
    }
}
