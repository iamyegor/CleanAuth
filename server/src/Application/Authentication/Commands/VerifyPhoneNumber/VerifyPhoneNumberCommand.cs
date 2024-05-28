using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.VerifyPhoneNumber;

public record VerifyPhoneNumberCommand(UserId UserId, int Code, string? DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class VerifyPhoneNumberCommandHandler
    : IRequestHandler<VerifyPhoneNumberCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly JwtService _jwtService;

    public VerifyPhoneNumberCommandHandler(ApplicationContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<Result<Tokens, Error>> Handle(
        VerifyPhoneNumberCommand command,
        CancellationToken cancellationToken
    )
    {
        User? user = await _context.Users.SingleOrDefaultAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        if (user == null || user.PhoneNumberVerificationCode?.Value != command.Code)
        {
            return Errors.PhoneNumberVerificationCode.IsInvalid();
        }

        if (user.PhoneNumberVerificationCode!.IsExpired)
        {
            return Errors.PhoneNumberVerificationCode.IsExpired();
        }

        user.IsPhoneNumberVerified = true;
        user.PhoneNumberVerificationCode = null;

        Tokens tokens = _jwtService.GenerateTokens(user);
        user.AddRefreshToken(new RefreshToken(tokens.RefreshToken, Guid.Parse(command.DeviceId!)));

        await _context.SaveChangesAsync(cancellationToken);

        return tokens;
    }
}
