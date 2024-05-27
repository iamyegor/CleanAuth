using Domain.DomainErrors;

namespace Application.IntegrationTests.TestsData;

public class SignUpTestData
{
    public static IEnumerable<object[]> DoesNotAllowToSignup =>
        [
            [
                "yegor",
                "yegor",
                "yegor@google.com",
                "different@google.com",
                Errors.Login.IsAlreadyTaken("yegor")
            ],
            [
                "yegor",
                "different",
                "yegor@google.com",
                "yegor@google.com",
                Errors.Email.IsAlreadyTaken("yegor@google.com")
            ]
        ];
}
