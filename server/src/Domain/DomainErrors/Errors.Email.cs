namespace Domain.DomainErrors;

public static partial class Errors
{
    public class Email
    {
        public static Error IsRequired()
        {
            return new Error("email.is.required", "Email is required");
        }

        public static Error HasInvalidSignature(string value)
        {
            var details = new Dictionary<string, object?>() { ["email"] = value };
            return new Error("email.invalid.signature", "Email has invalid signature", details);
        }

        public static Error IsAlreadyTaken(string value)
        {
            return new Error(
                "email.already.taken",
                "User with the same email already exists",
                new Dictionary<string, object?>() { ["email"] = value }
            );
        }

        public static Error DoesNotExist(string emailOrLogin)
        {
            var details = new Dictionary<string, object?>() { ["emailOrLogin"] = emailOrLogin };
            return new Error("email.not.exists", "Email doesn't exist", details);
        }

        public static Error IsTooLong(string email)
        {
            var details = new Dictionary<string, object?>() { ["emailLength"] = email.Length };
            return new Error(
                "email.too.long",
                "Email can't be longer than 150 characters",
                details
            );
        }
    }
}
