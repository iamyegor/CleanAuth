using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication.Extensions;

public static class ResponseCookiesExtensions
{
    public static void Append(this IResponseCookies cookies, Tokens tokens)
    {
        cookies.Append(CookieTokens.Access.Name, tokens.AccessToken, CookieTokens.Access.Options);
        cookies.Append(
            CookieTokens.Refresh.Name,
            tokens.RefreshToken,
            CookieTokens.Refresh.Options
        );
    }
}
