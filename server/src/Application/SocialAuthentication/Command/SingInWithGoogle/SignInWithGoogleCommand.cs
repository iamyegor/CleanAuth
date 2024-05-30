using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Google.Apis.Auth;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Specifications.User;
using Infrastructure.TokensValidators;
using MediatR;
using XResults;

namespace Application.SocialAuthentication.Command.SingInWithGoogle;

public record SignInWithGoogleCommand(string IdToken, string? DeviceId)
    : IRequest<Result<(Tokens, SocialUserAuthenticationStatus), Error>>;

public class SignInWithGoogleCommandHandler
    : IRequestHandler<
        SignInWithGoogleCommand,
        Result<(Tokens, SocialUserAuthenticationStatus), Error>
    >
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;
    private readonly IGoogleIdTokenValidator _googleIdTokenValidator;

    public SignInWithGoogleCommandHandler(
        UserTokensUpdater userTokensUpdater,
        ApplicationContext context,
        IGoogleIdTokenValidator googleIdTokenValidator
    )
    {
        _userTokensUpdater = userTokensUpdater;
        _context = context;
        _googleIdTokenValidator = googleIdTokenValidator;
    }

    public async Task<Result<(Tokens, SocialUserAuthenticationStatus), Error>> Handle(
        SignInWithGoogleCommand command,
        CancellationToken ct
    )
    {
        Result<GoogleJsonWebSignature.Payload, Error> payloadOrError =
            await _googleIdTokenValidator.ValidateAsync(command.IdToken);

        if (payloadOrError.IsFailure)
        {
            return payloadOrError.Error;
        }

        Email email = Email.Create(payloadOrError.Value.Email).Value;
        User? userWithSameEmail = await _context.Query(new UserByEmailSpec(email.Value), ct);

        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        User user = await CreateOrUpdateSocialAuthUser(email, userWithSameEmail, ct);
        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);
        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        SocialUserAuthenticationStatus authStatus = GetSocialUserAuthenticationStatus(user);

        return Result.Ok((tokens, authStatus));
    }

    private async Task<User> CreateOrUpdateSocialAuthUser(
        Email email,
        User? userWithSameEmail,
        CancellationToken ct
    )
    {
        if (userWithSameEmail == null)
        {
            User user = User.CreateSocialAuthUser(email, AuthType.Google);
            _context.Users.Add(user);
            return user;
        }
        else
        {
            if (userWithSameEmail is { IsEmailVerified: true, IsPhoneNumberVerified: true })
            {
                return userWithSameEmail;
            }
            else
            {
                _context.Remove(userWithSameEmail);
                await _context.SaveChangesAsync(ct);

                User user = User.CreateSocialAuthUser(email, AuthType.Google, userWithSameEmail.Id);
                _context.Users.Add(user);
                return user;
            }
        }
    }

    private SocialUserAuthenticationStatus GetSocialUserAuthenticationStatus(User user)
    {
        if (user is { IsEmailVerified: true, IsPhoneNumberVerified: true })
        {
            return SocialUserAuthenticationStatus.CompletelyVerified;
        }
        else if (user.Login == null)
        {
            return SocialUserAuthenticationStatus.NeedsUsername;
        }

        throw new Exception("Should never get there");
    }
}
