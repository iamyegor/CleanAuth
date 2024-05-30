using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Application.SocialAuthentication.Command.AddLogin;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using FluentAssertions;
using XResults;

namespace Application.IntegrationTests.Tests.SocialAuthentication;

public class AddLoginCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public AddLoginCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Can_not_add_invalid_login()
    {
        User user = await _userFactory.CreateSocialUserAsync(
            AuthType.Google,
            login: "existingLogin"
        );
        var command = new AddLoginCommand(user.Id, "ab");

        SuccessOr<Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.Login.HasInvalidLength("ab"));
    }

    [Fact]
    public async Task Can_not_add_login_to_standard_auth_user()
    {
        User user = await _userFactory.CreateAsync();
        var command = new AddLoginCommand(user.Id, "newLogin");

        SuccessOr<Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.Login.CanNotBeAdded());
    }

    [Fact]
    public async Task Can_not_add_login_when_login_is_already_set()
    {
        // Arrange
        User user = await _userFactory.CreateSocialUserAsync(
            login: "existingLogin",
            email: "socialUser@google.com",
            authType: AuthType.Google
        );

        var command = new AddLoginCommand(user.Id, "newLogin");

        // Act
        SuccessOr<Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.Login.CanNotBeAdded());
    }

    [Fact]
    public async Task Successfully_adds_login_to_social_auth_user_without_login()
    {
        // Arrange
        User user = await _userFactory.CreateSocialUserAsync(
            login: null,
            email: "socialUser@google.com",
            authType: AuthType.Google
        );

        var command = new AddLoginCommand(user.Id, "newLogin");

        // Act
        SuccessOr<Error> result = await Mediator.Send(command);

        // Assert
        result.IsSuccess.Should().BeTrue();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb.ShouldHaveLogin("newLogin");
    }
}
