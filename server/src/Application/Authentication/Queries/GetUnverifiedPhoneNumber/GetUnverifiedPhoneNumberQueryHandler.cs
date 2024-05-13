using Dapper;
using Domain.DomainErrors;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.Authentication.Queries.GetUnverifiedPhoneNumber;

public class GetUnverifiedPhoneNumberQueryHandler
    : IRequestHandler<GetUnverifiedPhoneNumberQuery, Result<string, Error>>
{
    private readonly NpgsqlConnection _connection;

    public GetUnverifiedPhoneNumberQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connection = connectionFactory.Create();
    }

    public async Task<Result<string, Error>> Handle(
        GetUnverifiedPhoneNumberQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql = "select phone_number from users where id = @UserId";

        string? phoneNumber = await _connection.QuerySingleOrDefaultAsync<string>(
            sql,
            new { query.UserId }
        );

        if (phoneNumber == null)
        {
            return Errors.User.HasNoPhoneNumber(query.UserId);
        }

        return phoneNumber;
    }
}
