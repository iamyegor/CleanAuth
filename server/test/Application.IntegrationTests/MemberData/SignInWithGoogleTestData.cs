using Application.SocialAuthentication.Command.SignInWithVk;
using Infrastructure.SocialAuthentication;

namespace Application.IntegrationTests.MemberData;

public static class SignInWithGoogleTestData
{
    public static IEnumerable<object[]> GetAuthenticationStatusData =>
        new List<object[]>
        {
            new object[] { "tomtato", true, SocialAuthStatus.Verified },
            new object[] { null, false, SocialAuthStatus.NewUser },
        };
}
