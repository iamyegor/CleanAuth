using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain.DomainErrors;
using Domain.User;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using XResults;

namespace Infrastructure.Authentication;

public class JwtService
{
    private readonly JwtSettings _jwtSettings;

    public JwtService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public Tokens GenerateTokens(User user)
    {
        Claim[] claims =
        [
            new Claim(ClaimTypes.Name, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role.Value),
            new Claim("email", user.Email.Value),
            new Claim("emailVerified", user.IsEmailVerified.ToString()),
            new Claim("phoneNumber", user.PhoneNumber?.Value ?? string.Empty),
            new Claim("phoneNumberVerified", user.IsPhoneNumberVerified.ToString())
        ];

        string accessToken = GenerateAccessToken(claims);
        string refreshToken = GenerateRefreshToken();

        return new Tokens(accessToken, refreshToken);
    }

    private string GenerateAccessToken(Claim[] claims)
    {
        string secret = Environment.GetEnvironmentVariable("SECRET")!;
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            SecurityAlgorithms.HmacSha256
        );

        var jwt = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            expires: DateTime.UtcNow.AddMinutes(2),
            claims: claims,
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private string GenerateRefreshToken()
    {
        byte[] randomNumbers = new byte[32];

        using var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomNumbers);

        return Convert.ToBase64String(randomNumbers);
    }

    public Result<int, Error> ExtractUserIdFromToken(string? token)
    {
        string secret = Environment.GetEnvironmentVariable("SECRET")!;

        var validationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = _jwtSettings.Issuer,
            ValidAudience = _jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
        };

        try
        {
            var tokenSecurityHandler = new JwtSecurityTokenHandler();
            ClaimsPrincipal principal = tokenSecurityHandler.ValidateToken(
                token,
                validationParameters,
                out _
            );

            return int.Parse(principal.Identity!.Name!);
        }
        catch (SecurityTokenValidationException)
        {
            return Result.Fail(Errors.AccessToken.InvalidToken());
        }
    }
}
