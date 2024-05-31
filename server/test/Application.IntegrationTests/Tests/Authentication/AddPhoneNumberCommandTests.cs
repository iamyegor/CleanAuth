using Application.Authentication.Commands.AddPhoneNumber;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using FluentAssertions;
using Infrastructure.Data;
using Infrastructure.Sms;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using XResults;

namespace Application.IntegrationTests.Tests.Authentication;

public class AddPhoneNumberCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public AddPhoneNumberCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Does_not_allow_invalid_phone_number()
    {
        var command = new AddPhoneNumberCommand(new UserId(Guid.NewGuid()), "invalid_phone");

        SuccessOr<Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.PhoneNumber.HasInvalidSignature("invalid_phone"));
    }

    [Fact]
    public async Task Successfully_adds_phone_number()
    {
        // Arrange
        User user = await _userFactory.CreateAsync();

        Mock<ISmsMessageBus> smsMessageBusMock = new Mock<ISmsMessageBus>();
        AddPhoneNumberCommandHandler handler = CreateCommandHandler(smsMessageBusMock);
        var command = new AddPhoneNumberCommand(user.Id, "+12345678901");

        // Act
        SuccessOr<Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.IsSuccess.Should().BeTrue();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb.ShouldHavePhoneNumber("+12345678901").ShouldHavePhoneNumberVerificationCode();

        smsMessageBusMock.Verify(sender =>
            sender.SendAsync(
                "+12345678901",
                $"Your verification code - {userFromDb.PhoneNumberVerificationCode!.Value}"
            )
        );
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public async Task Overwrites_unverified_user_phone_number(
        bool isEmailVerified,
        bool isPhoneNumberVerified
    )
    {
        // Arrange
        User existingUser = await _userFactory.CreateAsync(
            isEmailVerified: isEmailVerified,
            isPhoneNumberVerified: isPhoneNumberVerified,
            phoneNumber: "+12345678901"
        );

        User newUser = await _userFactory.CreateAsync(
            login: "newUser",
            email: "newEmail@google.com)",
            isEmailVerified: true
        );

        var command = new AddPhoneNumberCommand(newUser.Id, "+12345678901");

        Mock<ISmsMessageBus> smsMessageBusMock = new Mock<ISmsMessageBus>();
        AddPhoneNumberCommandHandler handler = CreateCommandHandler(smsMessageBusMock);

        // Act
        SuccessOr<Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.IsSuccess.Should().BeTrue();

        User newUserFromDb = _userRepository.QueryUserById(newUser.Id);
        newUserFromDb.ShouldHavePhoneNumber("+12345678901").ShouldHavePhoneNumberVerificationCode();

        User existingUserFromDb = _userRepository.QueryUserById(existingUser.Id);
        existingUserFromDb.ShouldNotHavePhoneNumber();

        smsMessageBusMock.Verify(sender =>
            sender.SendAsync(
                "+12345678901",
                $"Your verification code - {newUserFromDb.PhoneNumberVerificationCode!.Value}"
            )
        );
    }

    [Fact]
    public async Task Does_not_allow_to_add_phone_number_when_verified_user_with_same_phone_number_exists()
    {
        // Arrange
        await _userFactory.CreateAsync(
            isEmailVerified: true,
            isPhoneNumberVerified: true,
            phoneNumber: "+12345678901"
        );

        User user = await _userFactory.CreateAsync(login: "newUser", email: "new@mail.com");

        var command = new AddPhoneNumberCommand(user.Id, "+12345678901");

        // Act
        SuccessOr<Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.PhoneNumber.IsAlreadyTaken("+12345678901"));
    }

    private AddPhoneNumberCommandHandler CreateCommandHandler(
        Mock<ISmsMessageBus> smsMessageBusMock
    )
    {
        ApplicationContext context = ServiceProvider.GetRequiredService<ApplicationContext>();
        DomainSmsSender domainSmsSender = new DomainSmsSender(
            smsMessageBusMock.Object
        );
        AddPhoneNumberCommandHandler handler = new AddPhoneNumberCommandHandler(
            context,
            domainSmsSender
        );

        return handler;
    }
}
