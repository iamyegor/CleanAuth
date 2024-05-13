namespace Domain.DomainErrors;

public static partial class Errors
{
    public class Server
    {
        public static Error InternalServerError(string errorMessage)
        {
            return new Error("internal.server.error", errorMessage);
        }
    }
}