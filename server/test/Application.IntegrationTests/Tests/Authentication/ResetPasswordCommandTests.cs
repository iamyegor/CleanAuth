using Application.Authentication.Commands.ResetPassword;
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

public class ResetPasswordCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;
    private readonly DeviceIdFactory _deviceIdFactory;

    public ResetPasswordCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _deviceIdFactory = new DeviceIdFactory();
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Does_not_allow_invalid_user_id()
    {
        var command = new ResetPasswordCommand(
            "invalid-guid",
            "tokenString",
            "PasswordA123",
            _deviceIdFactory.Create()
        );

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.UserId.IsInvalid("invalid-guid"));
    }

    [Fact]
    public async Task Does_not_allow_invalid_device_id()
    {
        string deviceId = _deviceIdFactory.CreateInvalid();
        var command = new ResetPasswordCommand(
            Guid.NewGuid().ToString(),
            Guid.NewGuid().ToString(),
            "PasswordA123",
            deviceId
        );

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.DeviceId.IsInvalid(deviceId));
    }

    [Fact]
    public async Task Does_not_allow_invalid_token_string()
    {
        var command = new ResetPasswordCommand(
            Guid.NewGuid().ToString(),
            "invalid-guid",
            "PasswordA123",
            _deviceIdFactory.Create()
        );

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PasswordResetToken.IsInvalid("invalid-guid"));
    }

    [Fact]
    public async Task Does_not_allow_invalid_password()
    {
        var command = new ResetPasswordCommand(
            Guid.NewGuid().ToString(),
            Guid.NewGuid().ToString(),
            "",
            _deviceIdFactory.Create()
        );

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.Password.IsRequired());
    }

    [Fact]
    public async Task Fails_when_user_not_found()
    {
        var command = new ResetPasswordCommand(
            Guid.NewGuid().ToString(),
            Guid.NewGuid().ToString(),
            "PasswordA123",
            _deviceIdFactory.Create()
        );

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PasswordResetToken.IsInvalid(command.TokenString));
    }

    [Fact]
    public async Task Fails_when_provided_token_is_invalid()
    {
        // Arrange
        User user = await _userFactory.CreateAsync();

        var command = new ResetPasswordCommand(
            user.Id.Value.ToString(),
            Guid.NewGuid().ToString(),
            "PasswordA123",
            _deviceIdFactory.Create()
        );

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.PasswordResetToken.IsInvalid(command.TokenString));
    }

    [Fact]
    public async Task Fails_when_token_is_expired()
    {
        // Arrange
        IDateTimeProvider expiredDateTimeProvider = MockDateTimeProvider.CreateExpiredProvider;
        User user = await _userFactory.CreateAsync(
            passwordResetToken: new PasswordResetToken(expiredDateTimeProvider)
        );

        var command = new ResetPasswordCommand(
            user.Id.Value.ToString(),
            user.PasswordResetToken!.Value.ToString(),
            "PasswordA123",
            _deviceIdFactory.Create()
        );

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.PasswordResetToken.IsExpired());
    }

    [Fact]
    public async Task Fails_when_password_is_same_as_current()
    {
        // Arrange
        PasswordResetToken passwordResetToken = new PasswordResetToken(new DateTimeProvider());
        User user = await _userFactory.CreateAsync(
            password: "PasswordA123",
            passwordResetToken: passwordResetToken
        );

        var command = new ResetPasswordCommand(
            user.Id.Value.ToString(),
            passwordResetToken.Value.ToString(),
            "PasswordA123",
            _deviceIdFactory.Create()
        );

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.Password.IsSameAsCurrent());
    }

    [Fact]
    public async Task Successfully_resets_password()
    {
        // Arrange
        PasswordResetToken passwordResetToken = new PasswordResetToken(new DateTimeProvider());
        User user = await _userFactory.CreateAsync(passwordResetToken: passwordResetToken);
        string newPassword = "NewPasswordA123";

        string deviceId = _deviceIdFactory.Create();

        var command = new ResetPasswordCommand(
            user.Id.Value.ToString(),
            passwordResetToken.Value.ToString(),
            newPassword,
            deviceId
        );

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb
            .ShouldHavePassword(newPassword)
            .ShouldNotHavePasswordResetToken()
            .ShouldHaveOneRefreshToken(result.Value.RefreshToken, deviceId);
    }
}
