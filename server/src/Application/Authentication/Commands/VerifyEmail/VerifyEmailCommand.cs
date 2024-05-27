using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.VerifyEmail;

public record VerifyEmailCommand(UserId UserId, int Code) : IRequest<Result<Tokens, Error>>;

public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly JwtService _jwtService;

    public VerifyEmailCommandHandler(ApplicationContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<Result<Tokens, Error>> Handle(
        VerifyEmailCommand command,
        CancellationToken cancellationToken
    )
    {
        User? user = await _context.Users.SingleOrDefaultAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        if (user == null || user.EmailVerificationCode?.Value != command.Code)
        {
            return Errors.EmailVerificationCode.IsInvalid(command.Code);
        }

        if (user.EmailVerificationCode!.IsExpired)
        {
            return Errors.EmailVerificationCode.IsExpired();
        }

        user.IsEmailVerified = true;
        user.EmailVerificationCode = null;

        Tokens tokens = _jwtService.GenerateTokens(user);
        user.RefreshToken = new RefreshToken(tokens.RefreshToken);

        await _context.SaveChangesAsync(cancellationToken);

        return tokens;
    }
}
