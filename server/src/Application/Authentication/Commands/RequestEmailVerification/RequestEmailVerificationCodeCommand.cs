using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.RequestEmailVerification;

public record RequestEmailVerificationCodeCommand(UserId UserId) : IRequest<SuccessOr<Error>>;

public class RequestEmailVerificationCodeCommandHandler
    : IRequestHandler<RequestEmailVerificationCodeCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly IDomainEmailSender _emailSender;

    public RequestEmailVerificationCodeCommandHandler(
        ApplicationContext context,
        IDomainEmailSender emailSender
    )
    {
        _context = context;
        _emailSender = emailSender;
    }

    public async Task<SuccessOr<Error>> Handle(
        RequestEmailVerificationCodeCommand command,
        CancellationToken cancellationToken
    )
    {
        User? user = await _context.Query(new UserByIdSpec(command.UserId), cancellationToken);
        if (user == null)
        {
            return Errors.User.DoesNotExist(command.UserId);
        }

        if (user.IsEmailVerified || user.Email == null)
        {
            return Errors.Email.CanNotBeVerified();
        }

        user.NewEmailVerificationCode();
        await _context.SaveChangesAsync(cancellationToken);

        await _emailSender.SendEmailVerificationCode(
            user.Email.Value,
            user.EmailVerificationCode!.Value
        );

        return Result.Ok();
    }
}
