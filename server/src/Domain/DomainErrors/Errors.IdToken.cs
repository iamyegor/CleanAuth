namespace Domain.DomainErrors;

public static partial class Errors
{
    public static class IdToken
    {
        public static Error Invalid()
        {
            return new Error("id.token.invalid", "Id token is invalid");
        }
    }
}
