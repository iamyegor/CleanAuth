namespace Domain.DomainErrors;

public static partial class Errors
{
    public class Login
    {
        public static Error HasInvalidSymbols(string value)
        {
            var details = new Dictionary<string, object?>() { ["login"] = value };
            return new Error(
                "login.invalid.symbols",
                "Login can contain only numbers letters and underscores",
                details
            );
        }

        public static Error IsAlreadyTaken(string value)
        {
            var details = new Dictionary<string, object?>() { ["login"] = value };
            return new Error(
                "login.already.taken",
                "User with the same login already exists",
                details
            );
        }

        public static Error IsRequired()
        {
            return new Error("login.is.required", "Login is required");
        }

        public static Error HasInvalidLength(string login)
        {
            var details = new Dictionary<string, object?>() { ["loginLength"] = login.Length };
            return new Error(
                "login.invalid.length",
                "Login must be from 3 to 32 characters",
                details
            );
        }

        public static Error CanNotBeAdded()
        {
            return new Error("login.can.not.be.added", "Login can not be added");
        }
    }
}
