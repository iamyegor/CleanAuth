using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication.Extensions;

public static class ResponseCookiesExtensions
{
    public static void Append(this IResponseCookies cookies, Tokens tokens)
    {
        cookies.Append(Cookies.AccessToken.Name, tokens.AccessToken, Cookies.AccessToken.Options);
        cookies.Append(
            Cookies.RefreshToken.Name,
            tokens.RefreshToken,
            Cookies.RefreshToken.Options
        );
    }
}
