using System.IdentityModel.Tokens.Jwt;
using Infrastructure.Authentication.Extensions;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Authentication;

public class JwtClaims
{
    public const string UserId = "userId";
    public const string IsEmailVerified = "emailVerified";
    public const string IsPhoneNumberVerified = "phoneNumberVerified";
    public const string Role = "role";

    public int GetUserIdFromCookieJwt(IRequestCookieCollection cookies)
    {
        string jwtString = cookies.Extract(CookieTokens.Access.Name);
        JwtSecurityToken jwt = new JwtSecurityTokenHandler().ReadJwtToken(jwtString);
        string claim = jwt.Claims.Single(c => c.Type == JwtClaims.UserId).Value;

        return int.Parse(claim);
    }
}
