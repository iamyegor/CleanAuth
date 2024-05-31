using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Google.Apis.Auth;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.Specifications.User;
using Infrastructure.TokensValidators;
using MediatR;
using XResults;

namespace Application.SocialAuthentication.Command.SingInWithGoogle;

public record SignInWithGoogleCommand(string IdToken, string? DeviceId)
    : IRequest<Result<SocialAuthResult, Error>>;

public class SignInWithGoogleCommandHandler
    : IRequestHandler<SignInWithGoogleCommand, Result<SocialAuthResult, Error>>
{
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;
    private readonly IGoogleIdTokenValidator _googleIdTokenValidator;
    private readonly SocialUserAuthStatusResolver _authStatusResolver;

    public SignInWithGoogleCommandHandler(
        UserTokensUpdater userTokensUpdater,
        ApplicationContext context,
        IGoogleIdTokenValidator googleIdTokenValidator,
        SocialUserAuthStatusResolver authStatusResolver
    )
    {
        _userTokensUpdater = userTokensUpdater;
        _context = context;
        _googleIdTokenValidator = googleIdTokenValidator;
        _authStatusResolver = authStatusResolver;
    }

    public async Task<Result<SocialAuthResult, Error>> Handle(
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

        SocialUserAuthStatus authStatus = _authStatusResolver.GetBasedOnUser(user);

        return Result.Ok(new SocialAuthResult(tokens, authStatus));
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
}
