using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.RefreshAccessToken;

public class RefreshAccessTokenCommandHandler
    : IRequestHandler<RefreshAccessTokenCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly JwtService _jwtService;

    public RefreshAccessTokenCommandHandler(ApplicationContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<Result<Tokens, Error>> Handle(
        RefreshAccessTokenCommand command,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(command.RefreshToken))
        {
            return Errors.RefreshToken.NotProvided();
        }

        User? user = _context.Users.FirstOrDefault(u =>
            u.RefreshToken != null && u.RefreshToken.Value == command.RefreshToken
        );
        if (user == null)
        {
            return Errors.User.NotFoundWithRefreshToken(command.RefreshToken);
        }

        if (
            user.RefreshToken == null
            || !user.RefreshToken.Matches(command.RefreshToken)
            || user.RefreshToken.IsExpired
        )
        {
            return Errors.RefreshToken.Invalid(command.RefreshToken);
        }

        Tokens tokens = _jwtService.GenerateTokens(user);
        user.RefreshToken = new RefreshToken(tokens.RefreshToken);

        await _context.SaveChangesAsync(cancellationToken);

        return tokens;
    }
}
