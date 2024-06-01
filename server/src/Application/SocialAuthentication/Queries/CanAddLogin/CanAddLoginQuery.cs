using Dapper;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.SocialAuthentication.Queries.CanAddLogin;

public record CanAddLoginQuery(UserId UserId) : IRequest<SuccessOr<Error>>;

public class CanAddLoginQueryHandler : IRequestHandler<CanAddLoginQuery, SuccessOr<Error>>
{
    private readonly DapperConnectionFactory _connectionFactory;

    public CanAddLoginQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<SuccessOr<Error>> Handle(CanAddLoginQuery query, CancellationToken ct)
    {
        string sql =
            @"
            select count(*)
            from users 
            where id = @UserId::uuid and login is null";

        NpgsqlConnection connection = _connectionFactory.Create();
        int returnedRows = await connection.QuerySingleAsync<int>(
            sql,
            new { UserId = query.UserId.Value }
        );

        if (returnedRows == 0)
        {
            return Errors.Login.CanNotBeAdded();
        }

        return Result.Ok();
    }
}
