using Domain.DomainErrors;
using Domain.User;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.Specifications.User;
using MediatR;
using XResults;

namespace Application.SocialAuthentication.Command.SignInWithVk;

public record SignInWithVkCommand(string SilentToken, string Uuid, string? DeviceId)
    : IRequest<Result<SocialAuthResult, Error>>;

public class SignInWithVkCommandHandler
    : IRequestHandler<SignInWithVkCommand, Result<SocialAuthResult, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;
    private readonly VkTokenManager _vkTokenManager;

    public SignInWithVkCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater,
        VkTokenManager vkTokenManager
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
        _vkTokenManager = vkTokenManager;
    }

    public async Task<Result<SocialAuthResult, Error>> Handle(
        SignInWithVkCommand command,
        CancellationToken ct
    )
    {
        Result<string, Error> vkUserId = await _vkTokenManager.GetVkUserId(
            command.SilentToken,
            command.Uuid,
            ct
        );

        if (vkUserId.IsFailure)
        {
            return vkUserId.Error;
        }

        UserByVkIdSpec spec = new UserByVkIdSpec(vkUserId);
        User? userWithSameVkId = await _context.Query(spec, ct);

        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        User? user;
        SocialAuthStatus authStatus;
        if (userWithSameVkId != null && userWithSameVkId.IsVerified)
        {
            user = userWithSameVkId;
            authStatus = SocialAuthStatus.Verified;
        }
        else
        {
            await _context.DeleteUserIfExistsAsync(userWithSameVkId, ct);

            user = User.CreateVkUser(vkUserId.Value);
            _context.Users.Add(user);
            authStatus = SocialAuthStatus.NewUser;
        }

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);
        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return Result.Ok(new SocialAuthResult(tokens, authStatus));
    }
}
