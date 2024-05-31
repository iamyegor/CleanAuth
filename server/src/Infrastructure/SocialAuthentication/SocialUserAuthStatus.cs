namespace Infrastructure.SocialAuthentication;

public class SocialUserAuthStatus
{
    public static readonly SocialUserAuthStatus NeedsUsername = new("needs_username");

    public static readonly SocialUserAuthStatus CompletelyVerified = new("completely_verified");
    public static readonly SocialUserAuthStatus NeedsEmail = new("needs_email");

    public string Status { get; }

    private SocialUserAuthStatus(string status)
    {
        Status = status;
    }
}
