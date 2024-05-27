using Infrastructure.Data;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Application.IntegrationTests.Base;

public class BaseIntegrationTest : IClassFixture<IntegrationTestWebApplicationFactory>
{
    protected readonly ISender Mediator;
    protected readonly IServiceProvider ServiceProvider;

    protected BaseIntegrationTest(IntegrationTestWebApplicationFactory factory)
    {
        IServiceScope scope = factory.Services.CreateScope();
        Mediator = scope.ServiceProvider.GetRequiredService<ISender>();
        ServiceProvider = scope.ServiceProvider;

        ClearDatabase();
    }

    protected static ApplicationContext CreateDbContext()
    {
        return DbContextProvider.Create();
    }

    private void ClearDatabase()
    {
        using ApplicationContext context = DbContextProvider.Create();

        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
    }
}
