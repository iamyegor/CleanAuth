using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using XResults;

namespace Application.Authentication.Commands.LogIn;

public record LogInCommand(string LoginOrEmail, string Password) : IRequest<Result<Tokens, Error>>;

public class LogInCommandHandler : IRequestHandler<LogInCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly JwtService _jwtService;

    public LogInCommandHandler(ApplicationContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<Result<Tokens, Error>> Handle(
        LogInCommand command,
        CancellationToken cancellationToken
    )
    {
        User? user = await _context.Users.SingleOrDefaultAsync(
            u =>
                (u.Login.Value == command.LoginOrEmail || u.Email.Value == command.LoginOrEmail)
                && u.IsEmailVerified,
            cancellationToken: cancellationToken
        );

        if (user == null || !user.Password.Matches(command.Password))
        {
            return Errors.User.HasInvalidCredentials(command.LoginOrEmail, command.Password);
        }

        Tokens tokens = _jwtService.GenerateTokens(user);
        user.RefreshToken = new RefreshToken(tokens.RefreshToken);

        await _context.SaveChangesAsync(cancellationToken);

        return tokens;
    }
}
