using Dapper;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.SocialAuthentication.Queries.CanAddLoginAndEmailQuery;

public record CanAddLoginAndEmailQuery(UserId UserId) : IRequest<SuccessOr<Error>>;

public class CanAddLoginAndEmailQueryHandler
    : IRequestHandler<CanAddLoginAndEmailQuery, SuccessOr<Error>>
{
    private readonly DapperConnectionFactory _connectionFactory;

    public CanAddLoginAndEmailQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<SuccessOr<Error>> Handle(CanAddLoginAndEmailQuery query, CancellationToken ct)
    {
        string sql = "select email, login from users where id = @UserId::uuid";

        NpgsqlConnection connection = _connectionFactory.Create();
        UserFromDb userFromDb = await connection.QuerySingleAsync<UserFromDb>(
            sql,
            new { UserId = query.UserId.Value }
        );

        if (userFromDb.Login != null)
        {
            return Errors.Login.CanNotBeAdded();
        }
        else if (userFromDb.Email != null)
        {
            return Errors.Email.CanNotBeAdded();
        }

        return Result.Ok();
    }

    internal class UserFromDb
    {
        public string? Email { get; set; }
        public string? Login { get; set; }
    }
}
