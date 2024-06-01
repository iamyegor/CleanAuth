namespace Domain.DomainErrors;

public static partial class Errors
{
    public class AccessToken
    {
        public static Error IsInvalid()
        {
            return new Error("access.token.invalid", "Invalid JWT access token");
        }

        public static Error IsRequired()
        {
            return new Error("access.token.is.required", "Access token is required");
        }
    }

}
