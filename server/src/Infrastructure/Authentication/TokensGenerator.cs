using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain.User;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication;

public class TokensGenerator
{
    private readonly JwtSettings _jwtSettings;

    public TokensGenerator(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public Tokens GenerateTokens(User user)
    {
        Claim[] claims =
        [
            new Claim(JwtClaims.UserId, user.Id.Value.ToString()),
            new Claim(JwtClaims.Role, user.Role.Value),
            new Claim(JwtClaims.IsEmailVerified, user.IsEmailVerified.ToString().ToLower()),
            new Claim(
                JwtClaims.IsPhoneNumberVerified,
                user.IsPhoneNumberVerified.ToString().ToLower()
            )
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
}
