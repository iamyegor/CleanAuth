using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.Specifications;
using MediatR;
using XResults;

namespace Application.SocialAuthentication.Command.SocialSignInCommand;

public abstract class SocialSignInCommand : IRequest<Result<SocialAuthResult, Error>>
{
    public string? DeviceId { get; }

    protected SocialSignInCommand(string deviceId)
    {
        DeviceId = deviceId;
    }
}

public abstract class SignInWithSocialCommandHandler<TCommand>
    : IRequestHandler<TCommand, Result<SocialAuthResult, Error>>
    where TCommand : SocialSignInCommand
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;

    protected SignInWithSocialCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
    }

    protected abstract Task<Result<string, Error>> GetSocialId(
        TCommand command,
        CancellationToken ct
    );

    protected abstract User CreateUser(string socialId);

    protected abstract ISingleSpecification<User> UserBySocialIdSpec(string socialId);

    public async Task<Result<SocialAuthResult, Error>> Handle(
        TCommand command,
        CancellationToken ct
    )
    {
        Result<string, Error> socialIdResult = await GetSocialId(command, ct);
        if (socialIdResult.IsFailure)
        {
            return socialIdResult.Error;
        }

        var spec = UserBySocialIdSpec(socialIdResult.Value);
        User? userWithSameSocialId = await _context.Query(spec, ct);

        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        User user;
        SocialAuthStatus authStatus;
        if (userWithSameSocialId != null && userWithSameSocialId.IsVerified)
        {
            user = userWithSameSocialId;
            authStatus = SocialAuthStatus.Verified;
        }
        else
        {
            await _context.DeleteUserIfExistsAsync(userWithSameSocialId, ct);

            user = CreateUser(socialIdResult.Value);
            _context.Users.Add(user);
            authStatus = SocialAuthStatus.NewUser;
        }

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);
        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return Result.Ok(new SocialAuthResult(tokens, authStatus));
    }
}
