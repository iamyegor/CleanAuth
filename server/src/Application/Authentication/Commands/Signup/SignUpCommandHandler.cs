using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Emails;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.Signup;

public class SignUpCommandHandler : IRequestHandler<SignUpCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly DomainEmailSender _emailSender;
    private readonly JwtService _jwtService;

    public SignUpCommandHandler(
        ApplicationContext context,
        DomainEmailSender emailSender,
        JwtService jwtService
    )
    {
        _context = context;
        _emailSender = emailSender;
        _jwtService = jwtService;
    }

    public async Task<Result<Tokens, Error>> Handle(
        SignUpCommand command,
        CancellationToken cancellationToken
    )
    {
        EmailVerificationCode verificationCode = new EmailVerificationCode();
        Password password = Password.Create(command.Password);
        Login login = Login.Create(command.Login);
        Email email = Email.Create(command.Email);

        User? existingUser = await _context.Users.SingleOrDefaultAsync(
            u => u.Login.Value == command.Login || u.Email.Value == command.Email,
            cancellationToken: cancellationToken
        );

        User finalUser;
        if (existingUser == null)
        {
            finalUser = new User(login, email, password, verificationCode);
            await _context.Users.AddAsync(finalUser, cancellationToken);
        }
        else
        {
            if (existingUser is { IsEmailVerified: true, IsPhoneNumberVerified: true })
            {
                return UserAlreadyExists(existingUser, command.Login, command.Email);
            }

            finalUser = UpdateExistingUser(existingUser, login, email, password, verificationCode);
        }

        Tokens tokens = _jwtService.GenerateTokens(finalUser);
        finalUser.RefreshToken = new RefreshToken(tokens.RefreshToken);

        await _context.SaveChangesAsync(cancellationToken);

        await _emailSender.SendEmailVerificationCode(email.Value, verificationCode.Value);

        return tokens;
    }

    private Error UserAlreadyExists(User user, string login, string email)
    {
        return user.Login.Value == login
            ? Errors.Login.IsAlreadyTaken(login)
            : Errors.Email.IsAlreadyTaken(email);
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
        User user = new User(login, email, password, verificationCode, existingUser.Id);
        _context.Update(user);

        return user;
    }
}
