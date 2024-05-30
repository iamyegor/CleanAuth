using Application.Authentication.Commands.VerifyEmail;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Mocks;
using Application.IntegrationTests.Repositories;
using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using FluentAssertions;
using Infrastructure.Authentication;
using XResults;

namespace Application.IntegrationTests.Tests.Authentication;

public class VerifyEmailCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;
    private readonly DeviceIdFactory _deviceIdFactory;

    public VerifyEmailCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _deviceIdFactory = new DeviceIdFactory();
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Theory]
    [InlineData(1234)]
    [InlineData(123456)]
    public async Task Does_not_verify_email_with_invalid_code_length(int code)
    {
        var user = await _userFactory.CreateAsync();
        var command = new VerifyEmailCommand(user.Id, code, _deviceIdFactory.Create());

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.HasIncorrectLength(code));
    }

    [Fact]
    public async Task Does_not_allow_invalid_device_id()
    {
        string deviceId = _deviceIdFactory.CreateInvalid();
        var command = new VerifyEmailCommand(new UserId(Guid.NewGuid()), 12345, deviceId);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.DeviceId.IsInvalid(deviceId));
    }

    [Fact]
    public async Task Does_not_verify_email_with_invalid_code()
    {
        EmailVerificationCode emailVerificationCode = new EmailVerificationCode(
            new DateTimeProvider()
        );
        var user = await _userFactory.CreateAsync(emailVerificationCode: emailVerificationCode);
        string deviceId = _deviceIdFactory.Create();
        var command = new VerifyEmailCommand(user.Id, emailVerificationCode.Value - 1, deviceId);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.IsInvalid(12345));
    }

    [Fact]
    public async Task Does_not_verify_email_if_code_is_expired()
    {
        // Arrange
        var emailVerificationCode = new EmailVerificationCode(
            MockDateTimeProvider.CreateExpiredProvider
        );

        var user = await _userFactory.CreateAsync(
            isEmailVerified: false,
            emailVerificationCode: emailVerificationCode
        );

        string deviceId = _deviceIdFactory.Create();
        var command = new VerifyEmailCommand(user.Id, emailVerificationCode.Value, deviceId);

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.EmailVerificationCode.IsExpired());
    }

    [Fact]
    public async Task Successfully_verifies_email_with_valid_code()
    {
        // Arrange
        var emailVerificationCode = new EmailVerificationCode(new MockDateTimeProvider());
        var user = await _userFactory.CreateAsync(
            isEmailVerified: false,
            emailVerificationCode: emailVerificationCode
        );

        string deviceId = _deviceIdFactory.Create();
        var command = new VerifyEmailCommand(user.Id, emailVerificationCode.Value, deviceId);

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb
            .ShouldHaveVerifiedEmail()
            .ShouldNotHaveEmailVerificationCode()
            .ShouldHaveOneRefreshToken(result.Value.RefreshToken, deviceId);
    }

    [Fact]
    public async Task Does_not_verify_email_if_user_does_not_exist()
    {
        string deviceId = _deviceIdFactory.Create();
        var command = new VerifyEmailCommand(new UserId(Guid.NewGuid()), 12345, deviceId);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.IsInvalid(12345));
    }
}
