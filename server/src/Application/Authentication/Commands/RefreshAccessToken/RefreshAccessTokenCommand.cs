using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.RefreshAccessToken;

public record RefreshAccessTokenCommand(string? RefreshToken, string? DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class RefreshAccessTokenCommandHandler
    : IRequestHandler<RefreshAccessTokenCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;

    public RefreshAccessTokenCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
    }

    public async Task<Result<Tokens, Error>> Handle(
        RefreshAccessTokenCommand command,
        CancellationToken ct
    )
    {
        Guid deviceId = Guid.Parse(command.DeviceId!);

        var spec = new UserByRefreshTokenSpec(command.RefreshToken, deviceId);
        User? user = await _context.Query(spec, ct);

        if (user == null || user.IsRefreshTokenExpired(deviceId))
        {
            return Errors.RefreshToken.IsInvalid(command.RefreshToken!);
        }

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, deviceId);

        await _context.SaveChangesAsync(ct);

        return tokens;
    }
}
