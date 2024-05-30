using Infrastructure.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Authorization;

public static class AuthorizationPolicies
{
    public const string AccountAuthenticated = "AccountAuthenticatedPolicy";
    public const string EmailVerified = "EmailVerifiedPolicy";
    public const string EmailNotVerified = "NeedToVerifyEmailPolicy";
    public const string PhoneNumberNotVerified = "PhoneNumberVerified";

    public static void AddPolicies(AuthorizationOptions config)
    {
        config.AddPolicy(
            EmailVerified,
            p => p.RequireClaim(JwtClaims.IsEmailVerified, "true")
        );

        config.AddPolicy(
            PhoneNumberNotVerified,
            p =>
            {
                p.RequireClaim(JwtClaims.IsPhoneNumberVerified, "false");
            }
        );

        config.AddPolicy(
            EmailNotVerified,
            p =>
            {
                p.RequireClaim(JwtClaims.IsEmailVerified, "false");
            }
        );

        config.AddPolicy(
            AccountAuthenticated,
            p =>
            {
                p.RequireClaim(JwtClaims.IsEmailVerified, "true");
                p.RequireClaim(JwtClaims.IsPhoneNumberVerified, "true");
            }
        );
    }
}
