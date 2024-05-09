using Ardalis.GuardClauses;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Infrastructure.Data;

public class DapperConnectionFactory
{
    private readonly string _connectionString;

    public DapperConnectionFactory(IConfiguration configuration)
    {
        _connectionString = Guard.Against.Null(configuration.GetConnectionString("Default"));
    }

    public NpgsqlConnection Create() => new NpgsqlConnection(_connectionString);
}
