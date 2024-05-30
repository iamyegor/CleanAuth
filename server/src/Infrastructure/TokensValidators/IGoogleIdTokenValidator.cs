using Domain.DomainErrors;
using Google.Apis.Auth;
using XResults;

namespace Infrastructure.TokensValidators;

public interface IGoogleIdTokenValidator
{
    Task<Result<GoogleJsonWebSignature.Payload, Error>> ValidateAsync(string idToken);
}
