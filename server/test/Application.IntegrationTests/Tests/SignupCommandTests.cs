using Application.Authentication.Commands.Signup;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Application.IntegrationTests.TestsData;
using Domain.DomainErrors;
using Domain.User;
using FluentAssertions;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Emails;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using XResults;

namespace Application.IntegrationTests.Tests;

public class SignupCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public SignupCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Doesn_not_allow_invalid_login()
    {
        var command = new SignUpCommand("", "yegor@google.com", "PasswordA123");

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.Login.IsRequired());
    }

    [Fact]
    public async Task Doesn_not_allow_invalid_email()
    {
        var command = new SignUpCommand("yegor", "yegor", "PasswordA123");

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.Email.HasInvalidSignature("Email"));
    }

    [Fact]
    public async Task Doesn_not_allow_invalid_password()
    {
        var command = new SignUpCommand("yegor", "yegor@google.com", "");

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.Password.IsRequired());
    }

    [Fact]
    public async Task Successfully_sings_up_when_there_is_no_same_user()
    {
        // Arrange
        Mock<IDomainEmailSender> emailSenderMock = new Mock<IDomainEmailSender>();
        SignUpCommandHandler handler = CreateSignUpCommandHandler(emailSenderMock);
        var command = new SignUpCommand("yegor", "yegor@google.com", "passwordA123");

        // Act
        Result<Tokens, Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserByLogin("yegor");
        userFromDb
            .ShouldHaveEmail("yegor@google.com")
            .ShouldHavePassword("passwordA123")
            .ShouldHaveEmailVerificationCode()
            .ShouldHaveRefreshToken(result.Value.RefreshToken);

        emailSenderMock.Verify(sender =>
            sender.SendEmailVerificationCode(
                "yegor@google.com",
                userFromDb.EmailVerificationCode!.Value
            )
        );
    }

    [Theory]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(false, false)]
    public async Task Overwrites_existing_user_with_same_login_whose_account_is_not_verified(
        bool isEmailVerified,
        bool isPhoneNumberVerified
    )
    {
        // Arrange
        await _userFactory.CreateAsync(
            "yegor",
            "master@google.com",
            isEmailVerified: isEmailVerified,
            isPhoneNumberVerified: isPhoneNumberVerified
        );

        Mock<IDomainEmailSender> emailSenderMock = new Mock<IDomainEmailSender>();
        SignUpCommandHandler handler = CreateSignUpCommandHandler(emailSenderMock);
        var command = new SignUpCommand("yegor", "yegor@google.com", "passwordA123");

        // Act
        Result<Tokens, Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserByLogin("yegor");
        userFromDb
            .ShouldHaveEmail("yegor@google.com")
            .ShouldHavePassword("passwordA123")
            .ShouldHaveEmailVerificationCode()
            .ShouldHaveRefreshToken(result.Value.RefreshToken);

        emailSenderMock.Verify(sender =>
            sender.SendEmailVerificationCode(
                "yegor@google.com",
                userFromDb.EmailVerificationCode!.Value
            )
        );
    }

    [Theory]
    [MemberData(nameof(SignUpTestData.DoesNotAllowToSignup), MemberType = typeof(SignUpTestData))]
    public async Task Doesn_not_allow_to_sign_up_when_authenticated_user_with_same_login_or_email_exists(
        string existingUserLogin,
        string newLogin,
        string existingUserEmail,
        string newEmail,
        Error expectedError
    )
    {
        await _userFactory.CreateAsync(existingUserLogin, existingUserEmail, "existingPassword123");
        var command = new SignUpCommand(newLogin, newEmail, "passwordA123");

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(expectedError);
    }

    private SignUpCommandHandler CreateSignUpCommandHandler(
        Mock<IDomainEmailSender> emailSenderMock
    )
    {
        ApplicationContext context = ServiceProvider.GetRequiredService<ApplicationContext>();
        SignUpCommandHandler handler = new SignUpCommandHandler(
            context,
            emailSenderMock.Object,
            ServiceProvider.GetRequiredService<JwtService>()
        );

        return handler;
    }
}
