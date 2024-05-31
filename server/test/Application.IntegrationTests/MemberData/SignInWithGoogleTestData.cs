using Infrastructure.Authentication;
using Infrastructure.SocialAuthentication;

namespace Application.IntegrationTests.MemberData;

public static class SignInWithGoogleTestData
{
    public static IEnumerable<object[]> GetAuthenticationStatusData =>
        new List<object[]>
        {
            new object[] { "tomtato", true, SocialUserAuthStatus.CompletelyVerified },
            new object[] { null, false, SocialUserAuthStatus.NeedsUsername },
        };
}
