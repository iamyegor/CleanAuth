using Dapper;
using Domain.DomainErrors;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.Authentication.Queries.GetEmailForVerification;

public class GetEmailForVerificationQueryHandler
    : IRequestHandler<GetEmailForVerificationQuery, Result<string, Error>>
{
    private readonly DapperConnectionFactory _connectionFactory;

    public GetEmailForVerificationQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<string, Error>> Handle(
        GetEmailForVerificationQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql = "select email from users where id = @Id";

        NpgsqlConnection connection = _connectionFactory.Create();
        return await connection.QuerySingleAsync<string>(sql, new { Id = query.UserId.Value });
    }
}
