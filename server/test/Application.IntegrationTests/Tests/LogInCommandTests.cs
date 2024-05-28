using Application.Authentication.Commands.LogIn;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Domain.DomainErrors;
using Domain.User;
using FluentAssertions;
using Infrastructure.Authentication;
using XResults;

namespace Application.IntegrationTests.Tests;

public class LogInCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;
    private readonly DeviceIdFactory _deviceIdFactory;

    public LogInCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
        _deviceIdFactory = new DeviceIdFactory();
    }

    [Fact]
    public async Task Does_not_allow_invalid_login_or_email()
    {
        var command = new LogInCommand("", "PasswordA123", _deviceIdFactory.Create());

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.User.HasInvalidCredentials("", "PasswordA123"));
    }

    [Fact]
    public async Task Does_not_allow_invalid_password()
    {
        var command = new LogInCommand("yegor@google.com", "", _deviceIdFactory.Create());

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.User.HasInvalidCredentials("yegor@google.com", ""));
    }

    [Fact]
    public async Task Does_not_allow_invalid_device_id()
    {
        string deviceId = _deviceIdFactory.CreateInvalid();
        var command = new LogInCommand("yegor@google.com", "PasswordA123", deviceId);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.DeviceId.IsInvalid(deviceId));
    }

    [Fact]
    public async Task Successfully_logs_in_with_valid_credentials()
    {
        // Arrange
        await _userFactory.CreateAsync(email: "yegor@google.com", password: "PasswordA123");

        string deviceId = _deviceIdFactory.Create();
        var command = new LogInCommand("yegor@google.com", "PasswordA123", deviceId);

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserByEmail("yegor@google.com");
        userFromDb.ShouldHaveOneRefreshToken(result.Value.RefreshToken, deviceId);
    }

    [Theory]
    [InlineData("wrong_login", "PasswordA123")]
    [InlineData("yegor@google.com", "wrong_password")]
    public async Task Does_not_allow_login_with_invalid_credentials(
        string loginOrEmail,
        string password
    )
    {
        await _userFactory.CreateAsync(email: "yegor@google.com", password: "PasswordA123");
        string deviceId = _deviceIdFactory.Create();
        var command = new LogInCommand(loginOrEmail, password, deviceId);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.User.HasInvalidCredentials(loginOrEmail, password));
    }
}
