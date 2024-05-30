using Infrastructure.Authentication;

namespace Application.IntegrationTests.MemberData;

public static class SignInWithGoogleTestData
{
    public static IEnumerable<object[]> GetAuthenticationStatusData =>
        new List<object[]>
        {
            new object[] { "tomtato", true, SocialUserAuthenticationStatus.CompletelyVerified },
            new object[] { null, false, SocialUserAuthenticationStatus.NeedsUsername },
        };
}
