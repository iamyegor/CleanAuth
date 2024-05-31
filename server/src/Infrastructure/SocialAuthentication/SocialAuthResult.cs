using Infrastructure.Authentication;

namespace Infrastructure.SocialAuthentication;

public record SocialAuthResult(Tokens Tokens, SocialUserAuthStatus AuthStatus);
