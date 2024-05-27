using Application.Authentication.Commands.ResendPhoneNumberVerificationCodeCommand;
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

namespace Application.IntegrationTests.Tests;

public class ResendPhoneNumberVerificationCodeCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public ResendPhoneNumberVerificationCodeCommandTests(
        IntegrationTestWebApplicationFactory factory
    )
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Does_not_allow_to_resend_phone_number_verification_code_when_user_does_not_have_a_phone_number()
    {
        User user = await _userFactory.CreateAsync();
        var command = new ResendPhoneNumberVerificationCodeCommand(user.Id);

        SuccessOr<Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.User.HasNoPhoneNumber(user.Id));
    }

    [Fact]
    public async Task Successfully_resends_phone_number_verification_code()
    {
        // Arrange
        User user = await _userFactory.CreateAsync(phoneNumber: "+1234567890");

        Mock<ISmsMessageBus> smsMessageBusMock = new Mock<ISmsMessageBus>();
        var handler = CreateResendPhoneNumberCommandHandler(smsMessageBusMock);
        var command = new ResendPhoneNumberVerificationCodeCommand(user.Id);

        // Act
        SuccessOr<Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.IsSuccess.Should().BeTrue();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb.ShouldHavePhoneNumberVerificationCode();

        smsMessageBusMock.Verify(sender =>
            sender.SendAsync(
                user.PhoneNumber!.Value,
                $"Your verification code - {userFromDb.PhoneNumberVerificationCode!.Value}"
            )
        );
    }

    [Fact]
    public async Task Does_not_allow_to_resend_phone_number_verification_code_for_unexisting_user()
    {
        var command = new ResendPhoneNumberVerificationCodeCommand(new UserId(Guid.NewGuid()));

        Func<Task> action = async () =>
        {
            await Mediator.Send(command);
        };

        await action
            .Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage("Sequence contains no elements.");
    }

    private ResendPhoneNumberVerificationCodeCommandHandler CreateResendPhoneNumberCommandHandler(
        Mock<ISmsMessageBus> smsMessageBusMock
    )
    {
        ApplicationContext context = ServiceProvider.GetRequiredService<ApplicationContext>();
        VerificationCodeSender verificationCodeSender = new VerificationCodeSender(
            smsMessageBusMock.Object
        );
        return new ResendPhoneNumberVerificationCodeCommandHandler(context, verificationCodeSender);
    }
}
