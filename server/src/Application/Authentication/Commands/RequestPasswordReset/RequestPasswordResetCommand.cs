using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.RequestPasswordReset;

public record RequestPasswordResetCommand(string EmailOrLogin) : IRequest<SuccessOr<Error>>;

public class RequestPasswordResetCommandHandler
    : IRequestHandler<RequestPasswordResetCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly IDomainEmailSender _emailSender;

    public RequestPasswordResetCommandHandler(
        ApplicationContext context,
        IDomainEmailSender emailSender
    )
    {
        _context = context;
        _emailSender = emailSender;
    }

    public async Task<SuccessOr<Error>> Handle(
        RequestPasswordResetCommand command,
        CancellationToken cancellationToken
    )
    {
        User? user = await _context.Users.SingleOrDefaultAsync(
            u =>
                (u.Email.Value == command.EmailOrLogin || u.Login.Value == command.EmailOrLogin)
                && u.IsEmailVerified
                && u.IsPhoneNumberVerified,
            cancellationToken: cancellationToken
        );

        if (user == null)
        {
            return Errors.User.DoesNotExist(command.EmailOrLogin);
        }

        PasswordResetToken token = new PasswordResetToken(new DateTimeProvider());
        user.PasswordResetToken = token;
        await _emailSender.SendPasswordReset(user.Id.Value, token.Value, user.Email.Value);

        await _context.SaveChangesAsync(cancellationToken);

        return Result.Ok();
    }
}
