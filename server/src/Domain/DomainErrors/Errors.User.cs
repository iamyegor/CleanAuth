namespace Domain.DomainErrors;

public static partial class Errors
{
    public class User
    {
        public static Error HasInvalidCredentials(string login, string password)
        {
            var details = new Dictionary<string, object?>()
            {
                ["login"] = login,
                ["password"] = password
            };

            return new Error("invalid.credentials", "Invalid credentials", details);
        }

        public static Error DoesNotExist(Domain.User.ValueObjects.UserId userId)
        {
            var details = new Dictionary<string, object?>() { ["userId"] = userId.Value };
            return new Error("user.not.exists.with.id", "User doesn't exist", details);
        }

        public static Error DoesNotExist(string loginOrEamil)
        {
            var details = new Dictionary<string, object?>() { ["loginOrEmail"] = loginOrEamil };
            return new Error("user.not.exists.with.login.or.email", "User doesn't exist", details);
        }

        public static Error HasNoPhoneNumber(Domain.User.ValueObjects.UserId userId)
        {
            var details = new Dictionary<string, object?>() { ["userId"] = userId.Value };
            return new Error("user.has.no.phone.number", "User has no phone number", details);
        }

        public static Error AlreadyHasNumber(Domain.User.ValueObjects.UserId userId)
        {
            var details = new Dictionary<string, object?>() { ["userId"] = userId.Value };
            return new Error(
                "user.already.has.phone.number",
                "User already has phone number",
                details
            );
        }
    }
}
