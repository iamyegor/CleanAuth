using Domain.DomainErrors;
using Google.Apis.Auth;
using XResults;

namespace Infrastructure.TokensValidators;

public class GoogleIdTokenValidator : IGoogleIdTokenValidator
{
    public async Task<Result<GoogleJsonWebSignature.Payload, Error>> ValidateAsync(string idToken)
    {
        try
        {
            GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(
                idToken
            );

            return Result.Ok(payload);
        }
        catch (InvalidJwtException)
        {
            return Errors.IdToken.Invalid();
        }
    }
}
