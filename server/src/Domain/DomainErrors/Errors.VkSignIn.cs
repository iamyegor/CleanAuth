using System.Runtime.InteropServices.JavaScript;

namespace Domain.DomainErrors;

public static partial class Errors
{
    public class VkSignIn
    {
        public static Error FailedToExchangeSilentTokenForAccessToken()
        {
            return new Error(
                "vk.signin.failed.to.exchange.silent.token.for.access.token",
                "Failed to exchange silent token for access token"
            );
        }
    }
}
