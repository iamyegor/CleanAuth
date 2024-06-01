namespace Domain.DomainErrors;

public static partial class Errors
{
    public static class OdnoklassnikiSignIn
    {
        public static Error FailedToGetUserData()
        {
            return new Error(
                "odnoklassniki.signin.failed.to.get.user.data",
                "Failed to get user data from Odnoklassniki"
            );
        }
    }
}
