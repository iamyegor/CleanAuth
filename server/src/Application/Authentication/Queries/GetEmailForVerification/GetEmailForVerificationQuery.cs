using Dapper;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.Authentication.Queries.GetEmailForVerification;

public record GetEmailForVerificationQuery(UserId UserId) : IRequest<Result<string, Error>>;

public class GetEmailForVerificationQueryHandler
    : IRequestHandler<GetEmailForVerificationQuery, Result<string, Error>>
{
    private readonly NpgsqlConnection _connection;

    public GetEmailForVerificationQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connection = connectionFactory.Create();
    }

    public async Task<Result<string, Error>> Handle(
        GetEmailForVerificationQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql = "select email from users where id = @Id";
        
        return await _connection.QuerySingleAsync<string>(sql, new { Id = query.UserId.Value });
    }
}
