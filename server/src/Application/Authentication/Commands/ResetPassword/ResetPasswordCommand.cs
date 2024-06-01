using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.ResetPassword;

public record ResetPasswordCommand(
    string UserId,
    string TokenString,
    string Password,
    string? DeviceId
) : IRequest<Result<Tokens, Error>>;

public class ResetPasswordCommandHandler
    : IRequestHandler<ResetPasswordCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;

    public ResetPasswordCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
    }

    public async Task<Result<Tokens, Error>> Handle(
        ResetPasswordCommand command,
        CancellationToken ct
    )
    {
        UserId userId = new UserId(Guid.Parse(command.UserId));
        User? user = await _context.Query(new VerifiedUserByIdSpec(userId), ct);
        if (user == null || user.PasswordResetToken?.Value != Guid.Parse(command.TokenString))
        {
            return Errors.PasswordResetToken.IsInvalid(command.TokenString);
        }
        
        if (user.PasswordResetToken.IsExpired)
        {
            return Errors.PasswordResetToken.IsExpired();
        }
        
        if (user.Password != null && user.Password.Matches(command.Password))
        {
            return Errors.Password.IsSameAsCurrent();
        }

        user.Password = Password.Create(command.Password);
        user.PasswordResetToken = null;

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);

        await _context.SaveChangesAsync(ct);

        return tokens;
    }
}
