using Dapper;
using Domain.DomainErrors;
using Infrastructure.Data;
using MediatR;
using Npgsql;
using XResults;

namespace Application.Authentication.Queries.NeedToResetPassword;

public class NeedToResetPasswordQueryHandler
    : IRequestHandler<NeedToResetPasswordQuery, SuccessOr<Error>>
{
    private readonly NpgsqlConnection _connection;

    public NeedToResetPasswordQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connection = connectionFactory.Create();
    }

    public async Task<SuccessOr<Error>> Handle(
        NeedToResetPasswordQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql =
            @"
            select password_reset_token, password_reset_token_expiry_time
            from users 
            where id = @UserId::uuid";

        PasswordResetTokenInDb? data =
            await _connection.QueryFirstOrDefaultAsync<PasswordResetTokenInDb>(
                sql,
                new { query.UserId }
            );

        if (data == null || data.PasswordResetToken != Guid.Parse(query.Token))
        {
            return Errors.PasswordResetToken.IsInvalid(query.Token);
        }

        if (data.PasswordResetTokenExpiryTime < DateTime.UtcNow)
        {
            return Errors.PasswordResetToken.IsExpired();
        }

        return Result.Ok();
    }
}
