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
    private readonly DapperConnectionFactory _connectionFactory;

    public NeedToResetPasswordQueryHandler(DapperConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<SuccessOr<Error>> Handle(
        NeedToResetPasswordQuery query,
        CancellationToken cancellationToken
    )
    {
        string sql =
            @"
            select restore_password_token, restore_password_token_expiry_time 
            from users 
            where restore_password_token = @Token";

        NpgsqlConnection connection = _connectionFactory.Create();
        PasswordResetTokenInDb? token =
            await connection.QuerySingleOrDefaultAsync<PasswordResetTokenInDb>(
                sql,
                new { query.Token }
            );

        if (token == null)
        {
            return Errors.RestorePasswordToken.Incorrect(query.Token);
        }

        if (token.ExpiryTime < DateTime.UtcNow)
        {
            return Errors.RestorePasswordToken.IsExpired();
        }

        return Result.Ok();
    }
}
