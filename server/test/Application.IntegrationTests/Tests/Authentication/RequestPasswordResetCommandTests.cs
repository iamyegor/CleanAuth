using Application.Authentication.Commands.RequestPasswordReset;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Domain.DomainErrors;
using Domain.User;
using FluentAssertions;
using Infrastructure.Data;
using Infrastructure.Emails;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using XResults;

namespace Application.IntegrationTests.Tests.Authentication;

public class RequestPasswordResetCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public RequestPasswordResetCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Does_not_allow_unexisting_email_or_login()
    {
        var command = new RequestPasswordResetCommand("invalid");

        SuccessOr<Error> result = await Mediator.Send(command);

        result.Error.Should().Be(Errors.User.DoesNotExist("invalid"));
    }

    [Fact]
    public async Task Successfully_sends_reset_token_to_verified_user()
    {
        // Arrange
        Mock<IDomainEmailSender> emailSenderMock = new Mock<IDomainEmailSender>();
        RequestPasswordResetCommandHandler handler = CreateRequestPasswordResetCommandHandler(
            emailSenderMock
        );

        await _userFactory.CreateAsync();

        var command = new RequestPasswordResetCommand("yegor@google.com");

        // Act
        SuccessOr<Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.IsSuccess.Should().BeTrue();

        User userFromDb = _userRepository.QueryUserByEmail("yegor@google.com");
        userFromDb.ShouldHavePasswordResetToken();

        emailSenderMock.Verify(sender =>
            sender.SendPasswordReset(
                userFromDb.Id.Value,
                userFromDb.PasswordResetToken!.Value,
                "yegor@google.com"
            )
        );
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public async Task Does_not_send_reset_token_for_unverified_user(
        bool isEmailVerified,
        bool isPhoneNumberVerified
    )
    {
        // Arrange
        await _userFactory.CreateAsync(
            isEmailVerified: isEmailVerified,
            isPhoneNumberVerified: isPhoneNumberVerified
        );

        var command = new RequestPasswordResetCommand("yegor@google.com");

        // Act
        SuccessOr<Error> result = await Mediator.Send(command);

        // Assert
        result.Error.Should().Be(Errors.User.DoesNotExist("yegor@google.com"));
    }

    private RequestPasswordResetCommandHandler CreateRequestPasswordResetCommandHandler(
        Mock<IDomainEmailSender> emailSenderMock
    )
    {
        ApplicationContext context = ServiceProvider.GetRequiredService<ApplicationContext>();
        RequestPasswordResetCommandHandler handler = new RequestPasswordResetCommandHandler(
            context,
            emailSenderMock.Object
        );
        return handler;
    }
}
