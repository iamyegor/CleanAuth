namespace Infrastructure.Authentication;

public static class PoliciyNames
{
    public const string AccountAuthenticated = "AccountAuthenticatedPolicy";
    public const string EmailVerified = "EmailVerifiedPolicy";
    public const string EmailProvided = "EmailProvidedPolicy";
    public const string EmailNotVerified = "NeedToVerifyEmailPolicy";
    public const string PhoneNumberNotVerified = "PhoneNumberVerified";
}
