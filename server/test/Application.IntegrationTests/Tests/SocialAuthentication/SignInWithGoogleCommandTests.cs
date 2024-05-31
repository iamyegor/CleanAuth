using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.MemberData;
using Application.IntegrationTests.Repositories;
using Application.SocialAuthentication.Command.SignInWithVk;
using Application.SocialAuthentication.Command.SingInWithGoogle;
using Domain.DomainErrors;
using Domain.User;
using FluentAssertions;
using Google.Apis.Auth;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.TokensValidators;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using XResults;

namespace Application.IntegrationTests.Tests.SocialAuthentication;

public class SignInWithGoogleCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;
    private readonly DeviceIdFactory _deviceIdFactory;

    public SignInWithGoogleCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _deviceIdFactory = new DeviceIdFactory();
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Can_not_sign_in_when_invalid_device_id_is_provided()
    {
        string deviceId = _deviceIdFactory.CreateInvalid();
        var command = new SignInWithGoogleCommand("invalid_token", deviceId);

        Result<SocialAuthResult, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.DeviceId.IsInvalid(deviceId));
    }

    [Fact]
    public async Task Can_not_sign_in_with_invalid_id_token()
    {
        var command = new SignInWithGoogleCommand("invalid_token", _deviceIdFactory.Create());

        Result<SocialAuthResult, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.IdToken.Invalid());
    }

    [Fact]
    public async Task Signs_in_existing_user_with_valid_google_id_token()
    {
        // Arrange
        await _userFactory.CreateAsync(email: "test@google.com", isPhoneNumberVerified: true);

        var payload = new GoogleJsonWebSignature.Payload { Email = "test@google.com" };
        var validatorMock = new Mock<IGoogleIdTokenValidator>();
        validatorMock.Setup(v => v.ValidateAsync(It.IsAny<string>())).ReturnsAsync(payload);

        var handler = CreateSignInWithGoogleCommandHandler(validatorMock);

        SignInWithGoogleCommand command = new SignInWithGoogleCommand(
            "valid_token",
            _deviceIdFactory.Create()
        );

        // Act
        Result<SocialAuthResult, Error> result = await handler.Handle(
            command,
            new CancellationToken()
        );

        // Assert
        result.Value.Tokens.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.Tokens.RefreshToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Overwrites_existing_user_when_they_are_not_verified()
    {
        // Arrange
        await _userFactory.CreateAsync(
            email: "test@google.com",
            password: "abcdeg1233AA",
            login: "yegor",
            phoneNumber: "+1234567890",
            isPhoneNumberVerified: false,
            isEmailVerified: true
        );

        var payload = new GoogleJsonWebSignature.Payload { Email = "test@google.com" };
        var validatorMock = new Mock<IGoogleIdTokenValidator>();
        validatorMock.Setup(v => v.ValidateAsync(It.IsAny<string>())).ReturnsAsync(payload);

        var handler = CreateSignInWithGoogleCommandHandler(validatorMock);
        SignInWithGoogleCommand command = new SignInWithGoogleCommand(
            "valid_token",
            _deviceIdFactory.Create()
        );

        // Act
        await handler.Handle(command, new CancellationToken());

        // Assert
        User userFromDb = _userRepository.QueryUserByEmail("test@google.com");
        userFromDb.ShouldNotHavePassword().ShouldNotHaveLogin().ShouldNotHavePhoneNumber();
    }

    [Fact]
    public async Task Signs_in_new_user_with_valid_google_id_token()
    {
        // Arrange
        var payload = new GoogleJsonWebSignature.Payload { Email = "newuser@google.com" };
        var validatorMock = new Mock<IGoogleIdTokenValidator>();
        validatorMock.Setup(v => v.ValidateAsync(It.IsAny<string>())).ReturnsAsync(payload);

        var handler = CreateSignInWithGoogleCommandHandler(validatorMock);
        SignInWithGoogleCommand command = new SignInWithGoogleCommand(
            "valid_token",
            _deviceIdFactory.Create()
        );

        // Act
        Result<SocialAuthResult, Error> result = await handler.Handle(
            command,
            new CancellationToken()
        );

        // Assert
        result.Value.Tokens.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.Tokens.RefreshToken.Should().NotBeNullOrEmpty();
        result.Value.AuthStatus.Should().Be(SocialAuthStatus.NewUser);

        User userFromDb = _userRepository.QueryUserByEmail("newuser@google.com");
        userFromDb.Should().NotBeNull();
    }

    [Fact]
    public async Task Signs_in_completely_completely_when_exising_user_is_completely_verified()
    {
        // Arrange
        await _userFactory.CreateAsync(
            email: "test@google.com",
            isPhoneNumberVerified: true,
            isEmailVerified: true
        );

        var payload = new GoogleJsonWebSignature.Payload { Email = "test@google.com" };
        var validatorMock = new Mock<IGoogleIdTokenValidator>();
        validatorMock.Setup(v => v.ValidateAsync(It.IsAny<string>())).ReturnsAsync(payload);

        var handler = CreateSignInWithGoogleCommandHandler(validatorMock);
        SignInWithGoogleCommand command = new SignInWithGoogleCommand(
            "valid_token",
            _deviceIdFactory.Create()
        );

        // Act
        Result<SocialAuthResult, Error> result = await handler.Handle(
            command,
            new CancellationToken()
        );

        // Assert
        result.Value.AuthStatus.Should().Be(SocialAuthStatus.Verified);
    }

    [Theory]
    [MemberData(
        nameof(SignInWithGoogleTestData.GetAuthenticationStatusData),
        MemberType = typeof(SignInWithGoogleTestData)
    )]
    public async Task Signs_in_with_correct_authentication_status(
        string? login,
        bool isPhoneNumberVerified,
        SocialAuthStatus expectedStatus
    )
    {
        // Arrange
        var email = "test@google.com";
        await _userFactory.CreateGoogleUserAsync(
            login: login,
            email: email,
            isPhoneNumberVerified: isPhoneNumberVerified
        );

        var payload = new GoogleJsonWebSignature.Payload { Email = email };
        var validatorMock = new Mock<IGoogleIdTokenValidator>();
        validatorMock.Setup(v => v.ValidateAsync(It.IsAny<string>())).ReturnsAsync(payload);

        var handler = CreateSignInWithGoogleCommandHandler(validatorMock);
        var command = new SignInWithGoogleCommand("valid_token", _deviceIdFactory.Create());

        // Act
        Result<SocialAuthResult, Error> result = await handler.Handle(
            command,
            new CancellationToken()
        );

        // Assert
        result.Value.AuthStatus.Should().Be(expectedStatus);
    }

    private SignInWithGoogleCommandHandler CreateSignInWithGoogleCommandHandler(
        Mock<IGoogleIdTokenValidator> validatorMock
    )
    {
        ApplicationContext context = ServiceProvider.GetRequiredService<ApplicationContext>();
        UserTokensUpdater tokensUpdater = ServiceProvider.GetRequiredService<UserTokensUpdater>();

        SignInWithGoogleCommandHandler handler = new SignInWithGoogleCommandHandler(
            tokensUpdater,
            context,
            validatorMock.Object
        );

        return handler;
    }
}
