using Ardalis.GuardClauses;
using Domain.DomainErrors;
using Domain.User;
using Domain.User.ValueObjects;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.SocialAuthentication;
using Infrastructure.Specifications.User;
using MediatR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using XResults;

namespace Application.SocialAuthentication.Command.SignInWithVk;

public record SignInWithVkCommand(string SilentToken, string Uuid, string? DeviceId)
    : IRequest<Result<SocialAuthResult, Error>>;

public class SignInWithVkCommandHandler
    : IRequestHandler<SignInWithVkCommand, Result<SocialAuthResult, Error>>
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ApplicationContext _context;
    private readonly UserTokensUpdater _userTokensUpdater;
    private readonly SocialUserAuthStatusResolver _authStatusResolver;

    public SignInWithVkCommandHandler(
        HttpClient httpClient,
        IConfiguration configuration,
        ApplicationContext context,
        UserTokensUpdater userTokensUpdater,
        SocialUserAuthStatusResolver authStatusResolver
    )
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _context = context;
        _userTokensUpdater = userTokensUpdater;
        _authStatusResolver = authStatusResolver;
    }

    public async Task<Result<SocialAuthResult, Error>> Handle(
        SignInWithVkCommand command,
        CancellationToken ct
    )
    {
        VkAccessToken vkAccessToken = await ExchangeSilentTokenForAccessToken(command, ct);

        PhoneNumber phoneNumber = PhoneNumber.Create("+" + vkAccessToken.Phone);
        User? userWithSamePhone = await _context.Query(
            new UserByPhoneNumberSpec(phoneNumber.Value),
            ct
        );

        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        User? user;
        if (userWithSamePhone != null)
        {
            if (userWithSamePhone is { IsEmailVerified: true, IsPhoneNumberVerified: true })
            {
                user = userWithSamePhone;
            }
            else
            {
                _context.Remove(userWithSamePhone);
                await _context.SaveChangesAsync(ct);

                user = User.CreateSocialAuthUser(
                    phoneNumber,
                    AuthType.Google,
                    userWithSamePhone.Id
                );
                _context.Users.Add(user);
            }
        }
        else
        {
            user = User.CreateSocialAuthUser(phoneNumber, AuthType.Google);
            _context.Users.Add(user);
        }

        if (vkAccessToken.Email != null)
        {
            Email email = Email.Create(vkAccessToken.Email).Value;

            User? userWithSameEmail = await _context.Query(new UserByEmailSpec(email.Value), ct);

            if (
                userWithSameEmail != null
                && (userWithSameEmail.IsEmailVerified || userWithSameEmail.IsPhoneNumberVerified)
            )
            {
                _context.Remove(userWithSameEmail);
                await _context.SaveChangesAsync(ct);

                user.Email = email;
                user.VerifyEmail();
            }
        }

        // Tokens tokens = _userTokensUpdater.UpdateTokens(user, command.DeviceId!);
        // await _context.SaveChangesAsync(ct);
        // await transaction.CommitAsync(ct);
        //
        // SocialUserAuthStatus authStatus = _authStatusResolver.GetBasedOnUser(user);
        //
        // return Result.Ok(new SocialAuthResult(tokens, authStatus));
    }

    private async Task<Result<VkAccessToken, Error>> ExchangeSilentTokenForAccessToken(
        SignInWithVkCommand command,
        CancellationToken ct
    )
    {
        string serviceToken = Guard.Against.Null(_configuration["VKID:ServiceToken"]!);
        string tokenEndpoint = Guard.Against.Null(_configuration["VKID:TokenEndpoint"]!);

        FormUrlEncodedContent content = new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                { "v", "5.131" },
                { "token", command.SilentToken },
                { "access_token", serviceToken },
                { "uuid", command.Uuid }
            }
        );

        HttpResponseMessage response = await _httpClient.PostAsync(tokenEndpoint, content, ct);
        response.EnsureSuccessStatusCode();

        string responseContent = await response.Content.ReadAsStringAsync(ct);
        VkAccessToken? accessToken = JsonConvert.DeserializeObject<VkAccessToken>(responseContent);
        if (accessToken == null)
        {
            return Errors.VkSignIn.FailedToExchangeSilentTokenForAccessToken();
        }

        return accessToken;
    }
}
