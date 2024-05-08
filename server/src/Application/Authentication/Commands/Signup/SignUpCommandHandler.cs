using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Data;
using Infrastructure.Emails;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.Signup;

public class SignUpCommandHandler : IRequestHandler<SignUpCommand, SuccessOr<Error>>
{
    private readonly ApplicationContext _context;
    private readonly MessageBus _messageBus;

    public SignUpCommandHandler(
        ApplicationContext context,
        MessageBus messageBus
    )
    {
        _context = context;
        _messageBus = messageBus;
    }

    public async Task<SuccessOr<Error>> Handle(
        SignUpCommand command,
        CancellationToken cancellationToken
    )
    {
        var verificationCode = new EmailVerificationCode();
        Password password = Password.Create(command.Password);
        Login login = Login.Create(command.Login);
        Email email = Email.Create(command.Email);

        User? existingUser = await _context.Users.SingleOrDefaultAsync(
            u => u.Login.Value == command.Login || u.Email.Value == command.Email,
            cancellationToken: cancellationToken
        );

        if (existingUser == null)
        {
            User user = new User(login, email, password, verificationCode);
            await _context.Users.AddAsync(user, cancellationToken);
        }
        else
        {
            if (existingUser.IsEmailVerified)
            {
                return existingUser.Login.Value == command.Login
                    ? Errors.Login.TheSameLoginExists(command.Login)
                    : Errors.Login.TheSameEmailExists(command.Email);
            }
            else
            {
                // To perform context.Update() user with the same id must be detached.
                _context.Entry(existingUser).State = EntityState.Detached;
                User user = new User(login, email, password, verificationCode, existingUser.Id);
                _context.Update(user);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        _messageBus.SendEmailVerificationCode(email, verificationCode);

        return Result.Ok();
    }
}
