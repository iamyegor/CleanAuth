using Infrastructure.Data;
using Microsoft.Extensions.Configuration;

namespace Application.IntegrationTests.Base;

public class DbContextProvider
{
    private static string _connectionString = string.Empty;

    public static ApplicationContext Create()
    {
        if (string.IsNullOrEmpty(_connectionString))
        {
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            _connectionString = configuration.GetConnectionString("Default")!;
        }

        return new ApplicationContext(_connectionString, false);
    }
}
