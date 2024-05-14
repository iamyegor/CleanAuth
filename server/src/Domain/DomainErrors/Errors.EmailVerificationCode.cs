namespace Domain.DomainErrors;

public static partial class Errors
{
    public class EmailVerificationCode
    {
        public static Error IsExpired()
        {
            return new Error(
                "email.verification.code.expired",
                "Email verification code is expired"
            );
        }

        public static Error IsInvalid(object? value)
        {
            var details = new Dictionary<string, object?>() { ["code"] = value };
            return new Error("email.verification.code.invalid", $"Code is invalid", details);
        }

        public static Error HasIncorrectLength(int code)
        {
            var details = new Dictionary<string, object?>() { ["code"] = code };
            return new Error(
                "email.verification.code.invalid.length",
                "Email verification code must be 5 characters long",
                details
            );
        }
    }
}
