using Application.SocialAuthentication.Command.SocialSignInCommand;
using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.Specifications;
using Infrastructure.Specifications.User;
using XResults;

namespace Application.SocialAuthentication.Command.SignInWithOdnoklassniki;

public class SignInWithOdnoklassnikiCommand : SocialSignInCommand.SocialSignInCommand
{
    public string AccessToken { get; }
    public string SessionSecretKey { get; }

    public SignInWithOdnoklassnikiCommand(
        string accessToken,
        string sessionSecretKey,
        string deviceId
    )
        : base(deviceId)
    {
        AccessToken = accessToken;
        SessionSecretKey = sessionSecretKey;
    }
}

public class SignInWithOdnoklassnikiCommandHandler
    : SignInWithSocialCommandHandler<SignInWithOdnoklassnikiCommand>
{
    private readonly OdnoklassnikiTokenManager _odnoklassnikiTokenManager;

    public SignInWithOdnoklassnikiCommandHandler(
        OdnoklassnikiTokenManager odnoklassnikiTokenManager,
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater
    )
        : base(context, userTokensUpdater)
    {
        _odnoklassnikiTokenManager = odnoklassnikiTokenManager;
    }

    protected override async Task<Result<string, Error>> GetSocialId(
        SignInWithOdnoklassnikiCommand command,
        CancellationToken ct
    )
    {
        return await _odnoklassnikiTokenManager.GetOdnoklassnikiUserId(
            command.AccessToken,
            command.SessionSecretKey,
            ct
        );
    }

    protected override User CreateUser(string socialId)
    {
        return User.CreateOdnoklassnikiUser(socialId);
    }

    protected override ISingleSpecification<User> UserBySocialIdSpec(string socialId)
    {
        return new UserByOdnoklassnikiIdSpec(socialId);
    }
}
