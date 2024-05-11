using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.ResetPassword;

public class ResetPasswordCommandHandler
    : IRequestHandler<ResetPasswordCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;

    public ResetPasswordCommandHandler(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<SuccessOr<Error>> Handle(
        ResetPasswordCommand command,
        CancellationToken cancellationToken
    )
    {
        Guid token = Guid.Parse(command.TokenString);
        User? user = await _context.Users.FirstOrDefaultAsync(
            u => u.PasswordResetToken != null && u.PasswordResetToken.Value == token,
            cancellationToken: cancellationToken
        );

        if (user == null)
        {
            return Errors.RestorePasswordToken.Incorrect(token);
        }

        if (user.PasswordResetToken == null)
        {
            return Errors.RestorePasswordToken.WasntRequested();
        }

        if (user.PasswordResetToken.IsExpired)
        {
            return Errors.RestorePasswordToken.IsExpired();
        }

        return Result.Ok();
    }
}
