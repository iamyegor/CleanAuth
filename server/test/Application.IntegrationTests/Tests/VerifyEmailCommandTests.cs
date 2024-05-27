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

namespace Application.IntegrationTests.Tests;

public class VerifyEmailCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public VerifyEmailCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Theory]
    [InlineData(1234)]
    [InlineData(123456)]
    public async Task Does_not_verify_email_with_invalid_code_length(int code)
    {
        var user = await _userFactory.CreateAsync();
        var command = new VerifyEmailCommand(user.Id, code);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.HasIncorrectLength(code));
    }

    [Fact]
    public async Task Does_not_verify_email_with_invalid_code()
    {
        EmailVerificationCode emailVerificationCode = new EmailVerificationCode(
            new DateTimeProvider()
        );
        var user = await _userFactory.CreateAsync(emailVerificationCode: emailVerificationCode);
        var command = new VerifyEmailCommand(user.Id, emailVerificationCode.Value - 1);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.IsInvalid(12345));
    }

    [Fact]
    public async Task Does_not_verify_email_if_code_is_expired()
    {
        var emailVerificationCode = new EmailVerificationCode(
            MockDateTimeProvider.CreateExpiredProvider
        );
        var user = await _userFactory.CreateAsync(emailVerificationCode: emailVerificationCode);
        var command = new VerifyEmailCommand(user.Id, emailVerificationCode.Value);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.IsExpired());
    }

    [Fact]
    public async Task Successfully_verifies_email_with_valid_code()
    {
        // Arrange
        var emailVerificationCode = new EmailVerificationCode(new MockDateTimeProvider());
        var user = await _userFactory.CreateAsync(emailVerificationCode: emailVerificationCode);
        var command = new VerifyEmailCommand(user.Id, emailVerificationCode.Value);

        // Act
        Result<Tokens, Error> result = await Mediator.Send(command);

        // Assert
        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb
            .ShouldHaveVerifiedEmail()
            .ShouldNotHaveEmailVerificationCode()
            .ShouldHaveRefreshToken(result.Value.RefreshToken);
    }

    [Fact]
    public async Task Does_not_verify_email_if_user_does_not_exist()
    {
        var command = new VerifyEmailCommand(new UserId(Guid.NewGuid()), 12345);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.EmailVerificationCode.IsInvalid(12345));
    }
}
