namespace Domain.DomainErrors;

public static partial class Errors
{
    public class PasswordResetToken
    {
        public static Error IsInvalid(object value)
        {
            var details = new Dictionary<string, object?>() { ["token"] = value };
            return new Error(
                "restore.password.token.invalid",
                "Restore password token is invalid",
                details
            );
        }

        public static Error WasntRequested()
        {
            return new Error(
                "restore.password.token.wasnt.requested",
                "Restore password token wasn't requested"
            );
        }

        public static Error IsExpired()
        {
            return new Error("restore.password.token.expired", "Restore password token is expired");
        }
    }
}
