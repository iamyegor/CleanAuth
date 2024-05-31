using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Specifications.User;
using MediatR;
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
        CancellationToken ct
    )
    {
        var spec = new VerifiedUserByEmailOrLoginSpec(command.EmailOrLogin);
        User? user = await _context.Query(spec, ct);
        if (user == null)
        {
            return Errors.User.DoesNotExist(command.EmailOrLogin);
        }

        PasswordResetToken token = new PasswordResetToken(new DateTimeProvider());
        user.PasswordResetToken = token;

        await _context.SaveChangesAsync(ct);
        await _emailSender.SendPasswordReset(user.Id.Value, token.Value, user.Email!.Value);

        return Result.Ok();
    }
}
