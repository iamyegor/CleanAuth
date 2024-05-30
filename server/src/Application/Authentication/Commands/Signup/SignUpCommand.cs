using Domain.DateTimeProviders;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Specifications.User;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.Signup;

public record SignUpCommand(string Login, string Email, string Password, string DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class SignUpCommandHandler : IRequestHandler<SignUpCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly IDomainEmailSender _emailSender;
    private readonly UserTokensUpdater _userTokensUpdater;

    public SignUpCommandHandler(
        ApplicationContext context,
        IDomainEmailSender emailSender,
        UserTokensUpdater userTokensUpdater
    )
    {
        _context = context;
        _emailSender = emailSender;
        _userTokensUpdater = userTokensUpdater;
    }

    public async Task<Result<Tokens, Error>> Handle(SignUpCommand command, CancellationToken ct)
    {
        EmailVerificationCode verificationCode = new EmailVerificationCode(new DateTimeProvider());
        Password password = Password.Create(command.Password);
        Login login = Login.Create(command.Login);
        Email email = Email.Create(command.Email);

        var spec = new UserByEmailOrLoginSpec(command.Login, command.Email);
        User? existingUser = await _context.Query(spec, ct);

        if (
            existingUser != null
            && existingUser is { IsEmailVerified: true, IsPhoneNumberVerified: true }
        )
        {
            return UserAlreadyExists(existingUser, command.Login, command.Email);
        }

        User finalUser =
            existingUser == null
                ? await CreateNewUserAsync(login, email, password, verificationCode, ct)
                : UpdateExistingUser(existingUser, login, email, password, verificationCode);

        Tokens tokens = _userTokensUpdater.UpdateTokens(finalUser, command.DeviceId);

        await _context.SaveChangesAsync(ct);
        await _emailSender.SendEmailVerificationCode(email.Value, verificationCode.Value);

        return tokens;
    }

    private Error UserAlreadyExists(User user, string login, string email)
    {
        return user.Login != null && user.Login.Value == login
            ? Errors.Login.IsAlreadyTaken(login)
            : Errors.Email.IsAlreadyTaken(email);
    }

    private async Task<User> CreateNewUserAsync(
        Login login,
        Email email,
        Password password,
        EmailVerificationCode verificationCode,
        CancellationToken cancellationToken
    )
    {
        var newUser = User.CreateStandardAuthUser(login, email, password, verificationCode);
        await _context.Users.AddAsync(newUser, cancellationToken);
        return newUser;
    }

    private User UpdateExistingUser(
        User existingUser,
        Login login,
        Email email,
        Password password,
        EmailVerificationCode verificationCode
    )
    {
        // To perform context.Update(), user with the same id must be detached.
        _context.Entry(existingUser).State = EntityState.Detached;
        User user = User.CreateStandardAuthUser(
            login,
            email,
            password,
            verificationCode,
            existingUser.Id
        );
        _context.Update(user);

        return user;
    }
}
