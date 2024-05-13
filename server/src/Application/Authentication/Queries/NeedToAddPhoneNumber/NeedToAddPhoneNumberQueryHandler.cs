using Dapper;
using Domain.DomainErrors;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.Authentication.Queries.NeedToAddPhoneNumber;

public class NeedToAddPhoneNumberQueryHandler
    : IRequestHandler<NeedToAddPhoneNumberQuery, SuccessOr<Error>>
{
    private readonly NpgsqlConnection _connection;

    public NeedToAddPhoneNumberQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connection = connectionFactory.Create();
    }

    public async Task<SuccessOr<Error>> Handle(
        NeedToAddPhoneNumberQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql = "select phone_number from users where id = @UserId";

        string? phoneNumber = await _connection.QuerySingleOrDefaultAsync<string>(
            sql,
            new { UserId = query.UserId.Value }
        );

        if (phoneNumber != null)
        {
            return Errors.User.AlreadyHasNumber(query.UserId);
        }

        return Result.Ok();
    }
}
