using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.ResetPassword;

public class ResetPasswordCommandHandler
    : IRequestHandler<ResetPasswordCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly JwtService _jwtService;

    public ResetPasswordCommandHandler(ApplicationContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<Result<Tokens, Error>> Handle(
        ResetPasswordCommand command,
        CancellationToken cancellationToken
    )
    {
        UserId userId = new UserId(Guid.Parse(command.UserId));
        User? user = await _context.Users.FirstOrDefaultAsync(
            u => u.Id == userId,
            cancellationToken: cancellationToken
        );

        if (user == null || user.PasswordResetToken == null)
        {
            return Errors.PasswordResetToken.IsInvalid(command.TokenString);
        }

        if (user.PasswordResetToken.IsExpired)
        {
            return Errors.PasswordResetToken.IsExpired();
        }

        if (user.Password.Matches(command.Password))
        {
            return Errors.Password.IsSameAsCurrent();
        }

        user.SetPassword(Password.Create(command.Password));
        user.RemovePasswordResetToken();

        Tokens tokens = _jwtService.GenerateTokens(user);
        user.SetRefreshToken(new RefreshToken(tokens.RefreshToken));

        await _context.SaveChangesAsync(cancellationToken);

        return tokens;
    }
}
