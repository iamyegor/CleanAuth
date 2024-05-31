using Domain.User;
using Infrastructure.Authentication;

namespace Infrastructure.SocialAuthentication;

public class SocialUserAuthStatusResolver
{
    public SocialUserAuthStatus GetBasedOnUser(User user)
    {
        if (user is { IsEmailVerified: true, IsPhoneNumberVerified: true })
        {
            return SocialUserAuthStatus.CompletelyVerified;
        }
        else if (user.Login == null)
        {
            return SocialUserAuthStatus.NeedsUsername;
        }
        else if (user.Email == null)
        {
            return SocialUserAuthStatus.NeedsEmail;
        }

        throw new Exception("Should never get there");
    }
}
