namespace Domain.DomainErrors;

public static partial class Errors
{
    public class Password
    {
        public static Error HasInvalidLength(string value)
        {
            var details = new Dictionary<string, object?>() { ["password"] = value };
            return new Error(
                "password.invalid.length",
                "Password must be from 6 to 50 characters",
                details
            );
        }

        public static Error HasInvalidSignature(string value)
        {
            var details = new Dictionary<string, object?>() { ["password"] = value };
            return new Error(
                "password.invalid.signature",
                "Password must contain at least one upper case, one lower case letter and either one number or a special character",
                details
            );
        }

        public static Error IsSameAsCurrent()
        {
            return new Error("password.same.as.current", "Password is the same as the current one");
        }

        public static Error IsRequired()
        {
            return new Error("password.is.required", "Password is required");
        }
    }
}
