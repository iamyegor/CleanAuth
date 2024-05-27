using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.ResendEmailCommand;

public record ResendEmailCommand(UserId UserId) : IRequest<SuccessOr<Error>>;

public class ResendEmailCommandHandler : IRequestHandler<ResendEmailCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly IDomainEmailSender _emailSender;

    public ResendEmailCommandHandler(ApplicationContext context, IDomainEmailSender emailSender)
    {
        _context = context;
        _emailSender = emailSender;
    }

    public async Task<SuccessOr<Error>> Handle(
        ResendEmailCommand command,
        CancellationToken cancellationToken
    )
    {
        User user = await _context.Users.SingleAsync(
            u => u.Id == command.UserId,
            cancellationToken: cancellationToken
        );

        EmailVerificationCode code = new EmailVerificationCode(new DateTimeProvider());
        user.EmailVerificationCode = code;

        await _context.SaveChangesAsync(cancellationToken);
        await _emailSender.SendEmailVerificationCode(user.Email.Value, code.Value);

        return Result.Ok();
    }
}
