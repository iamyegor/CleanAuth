using System.IdentityModel.Tokens.Jwt;
using Domain.User.ValueObjects;
using Infrastructure.Cookies.Extensions;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication;

public class JwtClaims
{
    public const string UserId = "userId";
    public const string IsEmailVerified = "emailVerified";
    public const string IsPhoneNumberVerified = "phoneNumberVerified";
    public const string Role = "role";

    public UserId GetUserIdFromCookieJwt(IRequestCookieCollection cookies)
    {
        string jwtString = cookies.Extract(Cookies.CookiesInfo.AccessToken.Name);
        JwtSecurityToken jwt = new JwtSecurityTokenHandler().ReadJwtToken(jwtString);
        string claim = jwt.Claims.Single(c => c.Type == UserId).Value;

        return new UserId(Guid.Parse(claim));
    }
}
