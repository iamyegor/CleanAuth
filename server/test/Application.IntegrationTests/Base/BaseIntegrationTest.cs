using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Application.IntegrationTests.Base;

public class BaseIntegrationTest
    : IClassFixture<IntegrationTestWebApplicationFactory>,
        IClassFixture<DatabaseBuilder>
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

        foreach (var entityType in context.Model.GetEntityTypes())
        {
            string? tableName = entityType.GetTableName();
            string sql = $"DELETE FROM \"{tableName}\"";
            context.Database.ExecuteSqlRaw(sql);
        }
    }
}
