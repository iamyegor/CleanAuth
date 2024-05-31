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
    private readonly VkTokenExchanger _vkTokenExchanger;

    public SignInWithVkCommandHandler(
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater,
        VkTokenExchanger vkTokenExchanger
    )
    {
        _context = context;
        _userTokensUpdater = userTokensUpdater;
        _vkTokenExchanger = vkTokenExchanger;
    }

    public async Task<Result<SocialAuthResult, Error>> Handle(
        SignInWithVkCommand command,
        CancellationToken ct
    )
    {
        Result<VkAccessToken, Error> vkAccessToken =
            await _vkTokenExchanger.ExchangeSilentTokenForAccessToken(
                command.SilentToken,
                command.Uuid,
                ct
            );

        if (vkAccessToken.IsFailure)
        {
            return vkAccessToken.Error;
        }

        string vkUserId = vkAccessToken.Value.UserId.ToString();
        UserByVkIdSpec spec = new UserByVkIdSpec(vkUserId);
        User? userWithSameVkId = await _context.Query(spec, ct);

        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        User? user;
        SocialAuthStatus authStatus;
        if (
            userWithSameVkId != null
            && userWithSameVkId is { IsEmailVerified: true, IsPhoneNumberVerified: true }
        )
        {
            user = userWithSameVkId;
            authStatus = SocialAuthStatus.Verified;
        }
        else
        {
            if (userWithSameVkId != null)
            {
                _context.Remove(userWithSameVkId);
                await _context.SaveChangesAsync(ct);
            }

            user = User.CreateVkUser(vkUserId);
            _context.Users.Add(user);
            authStatus = SocialAuthStatus.NewUser;
        }

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);
        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return Result.Ok(new SocialAuthResult(tokens, authStatus));
    }
}
