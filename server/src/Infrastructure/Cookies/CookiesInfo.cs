using Microsoft.AspNetCore.Http;

namespace Infrastructure.Cookies;

public static class CookiesInfo
{
    public static class AccessToken
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

    public static class RefreshToken
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

    public static class DeviceId
    {
        public static string Name => "deviceId";
        public static CookieOptions Options =>
            new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(365),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };
    }
}
