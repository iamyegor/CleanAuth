using Application.Authentication.Commands.ResendEmailCommand;
using Application.IntegrationTests.Base;
using Application.IntegrationTests.CustomAssertions;
using Application.IntegrationTests.Factories;
using Application.IntegrationTests.Repositories;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using FluentAssertions;
using Infrastructure.Data;
using Infrastructure.Emails;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using XResults;

namespace Application.IntegrationTests.Tests.Authentication;

public class ResendEmailCommandTests : BaseIntegrationTest
{
    private readonly UserFactory _userFactory;
    private readonly UserRepository _userRepository;

    public ResendEmailCommandTests(IntegrationTestWebApplicationFactory factory)
        : base(factory)
    {
        _userFactory = new UserFactory();
        _userRepository = new UserRepository();
    }

    [Fact]
    public async Task Successfully_resends_email_verification_code()
    {
        // Arrange
        User user = await _userFactory.CreateAsync();

        var emailSenderMock = new Mock<IDomainEmailSender>();
        ResendEmailCommandHandler handler = CreateResendEmailCommandHandler(emailSenderMock);
        var command = new ResendEmailCommand(user.Id);

        // Act
        SuccessOr<Error> result = await handler.Handle(command, new CancellationToken());

        // Assert
        result.IsSuccess.Should().BeTrue();

        User userFromDb = _userRepository.QueryUserById(user.Id);
        userFromDb.ShouldHaveEmailVerificationCode();

        emailSenderMock.Verify(sender =>
            sender.SendEmailVerificationCode(
                userFromDb.Email.Value,
                userFromDb.EmailVerificationCode!.Value
            )
        );
    }

    private ResendEmailCommandHandler CreateResendEmailCommandHandler(
        Mock<IDomainEmailSender> emailSenderMock
    )
    {
        ApplicationContext context = ServiceProvider.GetRequiredService<ApplicationContext>();

        return new ResendEmailCommandHandler(context, emailSenderMock.Object);
    }
}
