namespace Infrastructure.Authentication;

public class SocialUserAuthenticationStatus
{
    public static readonly SocialUserAuthenticationStatus NeedsUsername = new("needs_username");

    public static readonly SocialUserAuthenticationStatus CompletelyVerified =
        new("completely_verified");

    public string Status { get; }

    private SocialUserAuthenticationStatus(string status)
    {
        Status = status;
    }
}
