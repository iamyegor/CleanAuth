using Infrastructure.Authentication;

namespace Infrastructure.SocialAuthentication;

public record SocialAuthResult(Tokens Tokens, SocialAuthStatus AuthStatus);
