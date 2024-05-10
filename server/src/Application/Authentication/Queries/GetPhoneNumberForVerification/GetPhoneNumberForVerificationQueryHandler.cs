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
    private readonly DapperConnectionFactory _connectionFactory;

    public GetPhoneNumberForVerificationQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<string, Error>> Handle(
        GetPhoneNumberForVerificationQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql = "select phone_number from users where id = @Id";

        NpgsqlConnection connection = _connectionFactory.Create();
        string? phoneNumber = await connection.QueryFirstOrDefaultAsync<string>(
            sql,
            new { Id = query.UserId.Value }
        );

        if (phoneNumber == null)
        {
            return Errors.User.NoPhoneNumber();
        }

        return phoneNumber;
    }
}
