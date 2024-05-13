namespace Domain.DomainErrors;

public static partial class Errors
{
    public class RefreshToken
    {
        public static Error IsInvalid(string value)
        {
            var details = new Dictionary<string, object?>() { ["refreshToken"] = value };
            return new Error("refresh.token.invalid", "Refresh token is invalid", details);
        }

        public static Error IsRequired()
        {
            return new Error("refresh.token.is.required", "Refresh token required");
        }
    }
}