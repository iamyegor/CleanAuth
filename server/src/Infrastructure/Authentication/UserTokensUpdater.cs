using Domain.User;
using Domain.User.ValueObjects;

namespace Infrastructure.Authentication;

public class UserTokensUpdater
{
    private readonly TokensGenerator _tokensGenerator;

    public UserTokensUpdater(TokensGenerator tokensGenerator)
    {
        _tokensGenerator = tokensGenerator;
    }

    public Tokens UpdateTokens(User user, string deviceId)
    {
        return UpdateTokens(user, Guid.Parse(deviceId));
    }

    public Tokens UpdateTokens(User user, Guid deviceId)
    {
        var tokens = _tokensGenerator.GenerateTokens(user);
        user.AddRefreshToken(new RefreshToken(tokens.RefreshToken, deviceId));

        return tokens;
    }
}
