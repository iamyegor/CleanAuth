using Infrastructure.Data;

namespace Application.IntegrationTests.Base;

public class DatabaseBuilder
{
    private static bool _isDatabaseCreated;

    public DatabaseBuilder()
    {
        if (!_isDatabaseCreated)
        {
            ApplicationContext context = DbContextProvider.Create();

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            _isDatabaseCreated = true;
        }
    }
}
