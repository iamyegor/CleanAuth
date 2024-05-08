using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication;

public static class CookieTokens
{
    public static class Access
    {
        public static string Name => "accessToken";
        public static CookieOptions Options =>
            new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(30),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };
    }

    public static class Refresh
    {
        public static string Name => "refreshToken";
        public static CookieOptions Options =>
            new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(30),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };
    }
}
