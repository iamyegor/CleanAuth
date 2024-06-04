using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.Authentication.Commands.LogIn;

public record LogInCommand(string LoginOrEmail, string Password, string DeviceId)
    : IRequest<Result<Tokens, Error>>;

public class LogInCommandHandler : IRequestHandler<LogInCommand, Result<Tokens, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;

    public LogInCommandHandler(ApplicationContext context, UserTokensUpdater userTokensUpdater)
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
    }

    public async Task<Result<Tokens, Error>> Handle(LogInCommand command, CancellationToken ct)
    {
        var spec = new VerifiedUserByEmailOrLoginSpec(command.LoginOrEmail);
        User? user = await _context.Query(spec, ct);
        if (user == null)
        {
            return Errors.User.DoesNotExist(command.LoginOrEmail);
        }

        if (user.Password == null || !user.Password.Matches(command.Password))
        {
            return Errors.User.HasInvalidPassword(command.Password);
        }

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId);

        await _context.SaveChangesAsync(ct);

        return tokens;
    }
}
