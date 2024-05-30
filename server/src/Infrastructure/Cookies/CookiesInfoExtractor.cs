using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Ardalis.GuardClauses;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Twilio.Http;
using XResults;

namespace Infrastructure.Cookies;

public class CookiesInfoExtractor
{
    private readonly JwtValidationParameters _jwtValidationParameters;

    public CookiesInfoExtractor(JwtValidationParameters jwtValidationParameters)
    {
        _jwtValidationParameters = jwtValidationParameters;
    }

    public Result<UserId, Error> ExtractUserId(IRequestCookieCollection cookies)
    {
        cookies.TryGetValue(CookiesInfo.AccessToken.Name, out var jwtToken);

        try
        {
            var tokenSecurityHandler = new JwtSecurityTokenHandler();
            ClaimsPrincipal principal = tokenSecurityHandler.ValidateToken(
                jwtToken,
                _jwtValidationParameters.GetParameters(),
                out _
            );

            string userIdString = Guard.Against.Null(principal.FindFirst(JwtClaims.UserId)).Value;
            return new UserId(Guid.Parse(userIdString));
        }
        catch (SecurityTokenValidationException)
        {
            return Result.Fail(Errors.AccessToken.IsInvalid());
        }
    }
}
