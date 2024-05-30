using Infrastructure.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Infrastructure.Authentication;

public class BearerEvents
{
    public static JwtBearerEvents ExtractTokenFromCookieEvent()
    {
        return new JwtBearerEvents()
        {
            OnMessageReceived = context =>
            {
                bool containsCookie = context.Request.Cookies.TryGetValue(
                    CookiesInfo.AccessToken.Name,
                    out var accesToken
                );

                if (containsCookie)
                {
                    context.Token = accesToken;
                }

                return Task.CompletedTask;
            }
        };
    }
}
