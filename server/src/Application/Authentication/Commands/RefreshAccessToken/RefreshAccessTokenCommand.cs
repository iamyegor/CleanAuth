using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.RefreshAccessToken;

public record RefreshAccessTokenCommand(string? RefreshToken, string DeviceId)
    : IRequest<Result<Tokens, Error>>;

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
        Guid deviceId = Guid.Parse(command.DeviceId);
        User? user = _context.Users.FirstOrDefault(u =>
            u.RefreshTokens.Any(t => t.Value == command.RefreshToken && t.DeviceId == deviceId)
        );

        if (user == null || user.IsRefreshTokenExpired(deviceId))
        {
            return Errors.RefreshToken.IsInvalid(command.RefreshToken!);
        }

        Tokens tokens = _jwtService.GenerateTokens(user);
        user.AddRefreshToken(new RefreshToken(tokens.RefreshToken, deviceId));

        await _context.SaveChangesAsync(cancellationToken);

        return tokens;
    }
}
