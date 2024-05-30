using Infrastructure.Authentication;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Cookies.Extensions;

public static class ResponseCookiesExtensions
{
    public static void Append(this IResponseCookies cookies, Tokens tokens)
    {
        cookies.Append(Cookies.CookiesInfo.AccessToken.Name, tokens.AccessToken, Cookies.CookiesInfo.AccessToken.Options);
        cookies.Append(
            Cookies.CookiesInfo.RefreshToken.Name,
            tokens.RefreshToken,
            Cookies.CookiesInfo.RefreshToken.Options
        );
    }
}
