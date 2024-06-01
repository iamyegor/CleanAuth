using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.SocialAuthentication.Command.AddLoginAndEmail;

public record AddLoginAndEmailCommand(UserId UserId, string Login, string Email)
    : IRequest<SuccessOr<Error>>;

public class AddLoginAndEmailCommandHandler
    : IRequestHandler<AddLoginAndEmailCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly IDomainEmailSender _emailSender;

    public AddLoginAndEmailCommandHandler(
        ApplicationContext context,
        IDomainEmailSender emailSender
    )
    {
        _context = context;
        _emailSender = emailSender;
    }

    public async Task<SuccessOr<Error>> Handle(
        AddLoginAndEmailCommand command,
        CancellationToken ct
    )
    {
        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        User? userWithSameEmail = await _context.Query(new UserByEmailSpec(command.Email), ct);
        if (userWithSameEmail != null)
        {
            if (userWithSameEmail.IsVerified)
            {
                return Errors.Email.IsAlreadyTaken(command.Email);
            }

            await _context.DeleteUserIfExistsAsync(userWithSameEmail, ct);
        }

        User? userWithSameLogin = await _context.Query(new UserByLoginSpec(command.Login), ct);
        if (userWithSameLogin != null)
        {
            if (userWithSameLogin.IsVerified)
            {
                return Errors.Login.IsAlreadyTaken(command.Login);
            }

            await _context.DeleteUserIfExistsAsync(userWithSameLogin, ct);
        }

        User user = (await _context.Query(new UserByIdSpec(command.UserId), ct))!;
        if (user.Login != null)
        {
            return Errors.Login.CanNotBeAdded();
        }
        else if (user.Email != null)
        {
            return Errors.Email.CanNotBeAdded();
        }

        user.Login = Login.Create(command.Login);
        user.Email = Email.Create(command.Email);
        user.NewEmailVerificationCode();

        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        await _emailSender.SendEmailVerificationCode(
            user.Email.Value,
            user.EmailVerificationCode!.Value
        );

        return Result.Ok();
    }
}
