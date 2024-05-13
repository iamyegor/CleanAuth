namespace Domain.DomainErrors;

public static partial class Errors
{
    public class UserId
    {
        public static Error IsInvalid(string value)
        {
            var details = new Dictionary<string, object?>() { ["userId"] = value };
            return new Error("invalid.user.id", "User id is invalid", details);
        }
    }
}