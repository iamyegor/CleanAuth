using Ardalis.GuardClauses;
using Domain.DomainErrors;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using XResults;

namespace Infrastructure.SocialAuthentication;

public class VkTokenExchangeResponse
{
    [JsonProperty("response")]
    public VkTokenExchangeResponseData? Response { get; set; }
}

public class VkTokenExchangeResponseData
{
    [JsonProperty("user_id")]
    public int UserId { get; set; }
}

public class VkTokenManager
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public VkTokenManager(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<Result<string, Error>> GetVkUserId(
        string silentToken,
        string uuid,
        CancellationToken ct
    )
    {
        string serviceToken = Guard.Against.Null(
            Environment.GetEnvironmentVariable("VKID_ServiceToken")
        );

        string tokenEndpoint = Guard.Against.Null(_configuration["VKID:TokenEndpoint"]);

        FormUrlEncodedContent content = new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                { "v", "5.131" },
                { "token", silentToken },
                { "access_token", serviceToken },
                { "uuid", uuid }
            }
        );

        HttpResponseMessage response = await _httpClient.PostAsync(tokenEndpoint, content, ct);
        try
        {
            response.EnsureSuccessStatusCode();
        }
        catch
        {
            return Errors.VkSignIn.FailedToExchangeSilentTokenForAccessToken();
        }

        string responseContent = await response.Content.ReadAsStringAsync(ct);
        VkTokenExchangeResponse? parsedResponse =
            JsonConvert.DeserializeObject<VkTokenExchangeResponse>(responseContent);

        if (parsedResponse?.Response == null)
        {
            return Errors.VkSignIn.FailedToExchangeSilentTokenForAccessToken();
        }

        return parsedResponse.Response.UserId.ToString();
    }
}
