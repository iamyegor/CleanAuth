using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Emails;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.Signup;

public record SignUpCommand(string Login, string Email, string Password, string DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class SignUpCommandHandler : IRequestHandler<SignUpCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;
    private readonly IDomainEmailSender _emailSender;

    public SignUpCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater,
        IDomainEmailSender emailSender
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
        _emailSender = emailSender;
    }

    public async Task<Result<Tokens, Error>> Handle(SignUpCommand command, CancellationToken ct)
    {
        Password password = Password.Create(command.Password);
        Login login = Login.Create(command.Login);
        Email email = Email.Create(command.Email);

        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        var spec = new UserByEmailOrLoginSpec(command.Login, command.Email);
        User? existingUser = await _context.Query(spec, ct);

        if (
            existingUser != null
            && existingUser is { IsEmailVerified: true, IsPhoneNumberVerified: true }
        )
        {
            return UserAlreadyExists(existingUser, command.Login, command.Email);
        }

        if (existingUser != null)
        {
            _context.Remove(existingUser);
            await _context.SaveChangesAsync(ct);
        }

        User user = User.CreateStandardAuthUser(login, email, password);
        _context.Users.Add(user);

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId);

        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        await _emailSender.SendEmailVerificationCode(
            email.Value,
            user.EmailVerificationCode!.Value
        );

        return tokens;
    }

    private Error UserAlreadyExists(User user, string login, string email)
    {
        return user.Login != null && user.Login.Value == login
            ? Errors.Login.IsAlreadyTaken(login)
            : Errors.Email.IsAlreadyTaken(email);
    }
}
