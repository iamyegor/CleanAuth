using Dapper;
using Domain.DomainErrors;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.Authentication.Queries.GetPhoneNumberForVerification;

public class GetPhoneNumberForVerificationQueryHandler
    : IRequestHandler<GetPhoneNumberForVerificationQuery, Result<string, Error>>
{
    private readonly NpgsqlConnection _connection;

    public GetPhoneNumberForVerificationQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connection = connectionFactory.Create();
    }

    public async Task<Result<string, Error>> Handle(
        GetPhoneNumberForVerificationQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql = "select phone_number from users where id = @Id";

        string? phoneNumber = await _connection.QueryFirstOrDefaultAsync<string>(
            sql,
            new { Id = query.UserId.Value }
        );

        if (phoneNumber == null)
        {
            return Errors.User.HasNoPhoneNumber(query.UserId);
        }

        return phoneNumber;
    }
}
