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

        SocialAuthStatus authStatus;
        User user;
        if (userWithSameEmail != null && userWithSameEmail.IsVerified)
        {
            user = userWithSameEmail;
            authStatus = SocialAuthStatus.Verified;
        }
        else
        {
            await _context.DeleteUserIfExistsAsync(userWithSameEmail, ct);

            user = User.CreateGoogleUser(email);
            _context.Users.Add(user);
            authStatus = SocialAuthStatus.NewUser;
        }

        Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);
        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return Result.Ok(new SocialAuthResult(tokens, authStatus));
    }
}
