using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication.Extensions;

public static class RequestCookiesExtensions
{
    public static string Extract(this IRequestCookieCollection cookies, string key)
    {
        bool extractionSuccessful = cookies.TryGetValue(
            Cookies.AccessToken.Name,
            out string? extractedValue
        );

        if (!extractionSuccessful)
        {
            throw new Exception($"Couldn't exctract a {key} cookie from request");
        }

        return extractedValue!;
    }
}
