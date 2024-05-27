using Application.Authentication.Commands.VerifyPhoneNumber;
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

public class VerifyPhoneNumberCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public VerifyPhoneNumberCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Theory]
    [InlineData(123)]
    [InlineData(12345)]
    public async Task Does_not_verify_phone_number_with_invalid_code_length(int code)
    {
        var user = await _userFactory.CreateAsync();
        var command = new VerifyPhoneNumberCommand(user.Id, code);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PhoneNumberVerificationCode.HasInvalidLength(code));
    }

    [Fact]
    public async Task Does_not_verify_phone_number_with_invalid_code()
    {
        PhoneNumberVerificationCode phoneNumberVerificationCode = new PhoneNumberVerificationCode(
            new DateTimeProvider()
        );
        var user = await _userFactory.CreateAsync(
            phoneNumberVerificationCode: phoneNumberVerificationCode
        );
        var command = new VerifyPhoneNumberCommand(user.Id, phoneNumberVerificationCode.Value - 1);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PhoneNumberVerificationCode.IsInvalid());
    }

    [Fact]
    public async Task Does_not_verify_phone_number_if_code_is_expired()
    {
        var phoneNumberVerificationCode = new PhoneNumberVerificationCode(
            MockDateTimeProvider.CreateExpiredProvider
        );
        var user = await _userFactory.CreateAsync(
            phoneNumberVerificationCode: phoneNumberVerificationCode
        );
        var command = new VerifyPhoneNumberCommand(user.Id, phoneNumberVerificationCode.Value);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PhoneNumberVerificationCode.IsExpired());
    }

    [Fact]
    public async Task Successfully_verifies_phone_number_with_valid_code()
    {
        var phoneNumberVerificationCode = new PhoneNumberVerificationCode(
            new MockDateTimeProvider()
        );
        var user = await _userFactory.CreateAsync(
            phoneNumberVerificationCode: phoneNumberVerificationCode
        );
        var command = new VerifyPhoneNumberCommand(user.Id, phoneNumberVerificationCode.Value);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Value.AccessToken.Should().NotBeNullOrEmpty();
        result.Value.RefreshToken.Should().NotBeNullOrEmpty();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb
            .ShouldHaveVerifiedPhoneNumber()
            .ShouldNotHavePhoneNumberVerificationCode()
            .ShouldHaveRefreshToken(result.Value.RefreshToken);
    }

    [Fact]
    public async Task Does_not_verify_phone_number_if_user_does_not_exist()
    {
        var command = new VerifyPhoneNumberCommand(new UserId(Guid.NewGuid()), 1234);

        Result<Tokens, Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PhoneNumberVerificationCode.IsInvalid());
    }
}
