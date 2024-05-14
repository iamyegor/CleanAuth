namespace Domain.DomainErrors;

public static partial class Errors
{
    public class PasswordResetToken
    {
        public static Error IsInvalid(object value)
        {
            var details = new Dictionary<string, object?>() { ["token"] = value };
            return new Error(
                "password.reset.token.invalid",
                "Password reset token is invalid",
                details
            );
        }

        public static Error IsExpired()
        {
            return new Error("password.reset.token.expired", "Password reset token is expired");
        }
    }
}
