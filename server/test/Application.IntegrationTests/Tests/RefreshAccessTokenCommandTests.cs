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

    public RefreshAccessTokenCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Does_not_allow_null_refresh_token()
    {
        var command = new RefreshAccessTokenCommand(null);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.RefreshToken.IsRequired());
    }

    [Fact]
    public async Task Does_not_allow_non_existing_token()
    {
        var command = new RefreshAccessTokenCommand("invalid_token");

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.RefreshToken.IsInvalid("invalid_token"));
    }

    [Fact]
    public async Task Successfully_refreshes_access_token_with_valid_refresh_token()
    {
        // Arrange
        User user = await _userFactory.CreateAsync();
        string refreshTokenString = await AddRefreshTokenToUser(user);

        var command = new RefreshAccessTokenCommand(refreshTokenString);

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb.ShouldHaveRefreshToken(result.Value.RefreshToken);
    }

    private async Task<string> AddRefreshTokenToUser(User user)
    {
        JwtService jwtService = ServiceProvider.GetRequiredService<JwtService>();
        string refreshTokenString = jwtService.GenerateTokens(user).RefreshToken;

        using (var context = CreateDbContext())
        {
            User userFromDb = context.Users.Single(u => u.Login.Value == "yegor");
            userFromDb.RefreshToken = new RefreshToken(refreshTokenString);

            await context.SaveChangesAsync();
        }

        return refreshTokenString;
    }
}
