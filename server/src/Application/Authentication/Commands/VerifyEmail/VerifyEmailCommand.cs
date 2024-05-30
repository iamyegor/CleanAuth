using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.VerifyEmail;

public record VerifyEmailCommand(UserId UserId, int Code, string? DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly TokensGenerator _tokensGenerator;

    public VerifyEmailCommandHandler(ApplicationContext context, TokensGenerator tokensGenerator)
    {
        _context = context;
        _tokensGenerator = tokensGenerator;
    }

    public async Task<Result<Tokens, Error>> Handle(
        VerifyEmailCommand command,
        CancellationToken ct
    )
    {
        User? user = await _context.Query(new UserByIdSpec(command.UserId), ct);
        if (user == null || user.EmailVerificationCode?.Value != command.Code)
        {
            return Errors.EmailVerificationCode.IsInvalid(command.Code);
        }

        if (user.EmailVerificationCode!.IsExpired)
        {
            return Errors.EmailVerificationCode.IsExpired();
        }

        user.VerifyEmail();

        Tokens tokens = _tokensGenerator.GenerateTokens(user);
        user.AddRefreshToken(new RefreshToken(tokens.RefreshToken, Guid.Parse(command.DeviceId!)));

        await _context.SaveChangesAsync(ct);

        return tokens;
    }
}
