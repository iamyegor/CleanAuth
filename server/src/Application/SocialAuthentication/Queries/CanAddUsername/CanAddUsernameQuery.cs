using Dapper;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.SocialAuthentication.Queries.CanAddUsername;

public record CanAddUsernameQuery(UserId UserId) : IRequest<SuccessOr<Error>>;

public class CanAddUsernameQueryHandler : IRequestHandler<CanAddUsernameQuery, SuccessOr<Error>>
{
    private readonly DapperConnectionFactory _connectionFactory;

    public CanAddUsernameQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<SuccessOr<Error>> Handle(CanAddUsernameQuery query, CancellationToken ct)
    {
        string sql =
            @"
            select count(*)
            from users 
            where id = @UserId::uuid and login is null and auth_type != 'Standard'";

        NpgsqlConnection connection = _connectionFactory.Create();
        int returnedRows = await connection.QuerySingleAsync<int>(
            sql,
            new { UserId = query.UserId.Value }
        );

        if (returnedRows == 0)
        {
            return Errors.User.CanNotAddUsername(query.UserId);
        }

        return Result.Ok();
    }
}
