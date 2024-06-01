using Application.SocialAuthentication.Command.SocialSignInCommand;
using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.Specifications;
using Infrastructure.Specifications.User;
using XResults;

namespace Application.SocialAuthentication.Command.SignInWithVk;

public class SignInWithVkCommand : SocialSignInCommand.SocialSignInCommand
{
    public string SilentToken { get; }
    public string Uuid { get; }

    public SignInWithVkCommand(string silentToken, string uuid, string deviceId)
        : base(deviceId)
    {
        SilentToken = silentToken;
        Uuid = uuid;
    }
}

public class SignInWithVkCommandHandler : SignInWithSocialCommandHandler<SignInWithVkCommand>
{
    private readonly VkTokenManager _vkTokenManager;

    public SignInWithVkCommandHandler(
        VkTokenManager vkTokenManager,
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater
    )
        : base(context, userTokensUpdater)
    {
        _vkTokenManager = vkTokenManager;
    }

    protected override async Task<Result<string, Error>> GetSocialId(
        SignInWithVkCommand command,
        CancellationToken ct
    )
    {
        return await _vkTokenManager.GetVkUserId(command.SilentToken, command.Uuid, ct);
    }

    protected override User CreateUser(string socialId)
    {
        return User.CreateVkUser(socialId);
    }

    protected override ISingleSpecification<User> UserBySocialIdSpec(string socialId)
    {
        return new UserByVkIdSpec(socialId);
    }
}
