using Domain.Common.Preconditions;
using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Specifications.User;
using MediatR;
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

    public async Task<SuccessOr<Error>> Handle(ResendEmailCommand command, CancellationToken ct)
    {
        User user = (await _context.Query(new UserByIdSpec(command.UserId), ct))!;

        EmailVerificationCode code = new EmailVerificationCode(new DateTimeProvider());
        user.EmailVerificationCode = code;

        await _context.SaveChangesAsync(ct);
        await _emailSender.SendEmailVerificationCode(user.Email.Value, code.Value);

        return Result.Ok();
    }
}
