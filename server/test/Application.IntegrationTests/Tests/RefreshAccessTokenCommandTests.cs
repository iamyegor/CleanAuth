using Application.Authentication.Commands.RefreshAccessToken;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using FluentAssertions;
using Infrastructure.Authentication;
using Microsoft.Extensions.DependencyInjection;
using XResults;

namespace Application.IntegrationTests.Tests;

public class RefreshAccessTokenCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;
    private readonly DeviceIdFactory _deviceIdFactory;

    public RefreshAccessTokenCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
        _deviceIdFactory = new DeviceIdFactory();
    }

    [Fact]
    public async Task Does_not_allow_null_refresh_token()
    {
        var command = new RefreshAccessTokenCommand(null, _deviceIdFactory.Create());

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.RefreshToken.IsRequired());
    }

    [Fact]
    public async Task Does_not_allow_invalid_device_id()
    {
        string deviceId = _deviceIdFactory.CreateInvalid();
        var command = new RefreshAccessTokenCommand("refresh_token", deviceId);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.DeviceId.IsInvalid(deviceId));
    }

    [Fact]
    public async Task Does_not_allow_non_existing_token()
    {
        var command = new RefreshAccessTokenCommand("invalid_token", _deviceIdFactory.Create());

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.RefreshToken.IsInvalid("invalid_token"));
    }

    [Fact]
    public async Task Successfully_refreshes_access_token_with_valid_refresh_token()
    {
        // Arrange
        User user = await _userFactory.CreateAsync();
        RefreshToken refreshToken = await AddRefreshTokenToUser(user);

        string deviceId = refreshToken.DeviceId.ToString();
        var command = new RefreshAccessTokenCommand(refreshToken.Value, deviceId);

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb.ShouldHaveOneRefreshToken(result.Value.RefreshToken, deviceId);
    }

    private async Task<RefreshToken> AddRefreshTokenToUser(User user)
    {
        JwtService jwtService = ServiceProvider.GetRequiredService<JwtService>();
        string refreshTokenString = jwtService.GenerateTokens(user).RefreshToken;

        using (var context = CreateDbContext())
        {
            User userFromDb = context.Users.Single(u => u.Login.Value == "yegor");
            RefreshToken refreshToken = new RefreshToken(
                refreshTokenString,
                _deviceIdFactory.CreateGuid()
            );

            userFromDb.AddRefreshToken(refreshToken);

            await context.SaveChangesAsync();

            return refreshToken;
        }
    }
}
