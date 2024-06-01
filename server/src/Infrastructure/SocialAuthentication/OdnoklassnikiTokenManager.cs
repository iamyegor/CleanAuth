using System.Security.Cryptography;
using System.Text;
using Ardalis.GuardClauses;
using Domain.DomainErrors;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using XResults;

namespace Infrastructure.SocialAuthentication;

public class OdnoklassnikiTokenManager
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public OdnoklassnikiTokenManager(IConfiguration configuration, HttpClient httpClient)
    {
        _configuration = configuration;
        _httpClient = httpClient;
    }

    public async Task<Result<string, Error>> GetOdnoklassnikiUserId(
        string accessToken,
        string sessionSecretKey,
        CancellationToken cancellationToken
    )
    {
        string applicationKey = Guard.Against.Null(_configuration["Odnoklassniki:ApplicationKey"]);

        var parameters = new Dictionary<string, string>
        {
            { "application_key", applicationKey },
            { "format", "json" },
            { "method", "users.getCurrentUser" }
        };

        var queryParams = new Dictionary<string, string>(parameters)
        {
            { "sig", GenerateSig(parameters, sessionSecretKey) },
            { "access_token", accessToken }
        };

        string url =
            "https://api.ok.ru/fb.do?"
            + string.Join("&", queryParams.Select(x => $"{x.Key}={x.Value}"));

        HttpResponseMessage response = await _httpClient.GetAsync(url, cancellationToken);
        try
        {
            response.EnsureSuccessStatusCode();
        }
        catch
        {
            return Errors.OdnoklassnikiSignIn.FailedToGetUserData();
        }

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        dynamic? jsonResponse = JsonConvert.DeserializeObject<dynamic>(content);

        if (jsonResponse?.uid == null)
        {
            return Errors.OdnoklassnikiSignIn.FailedToGetUserData();
        }

        return (string)jsonResponse.uid;
    }

    private string GenerateSig(Dictionary<string, string> parameters, string sessionSecretKey)
    {
        var sortedParams = parameters.OrderBy(p => p.Key).ToList();

        StringBuilder paramString = new StringBuilder();
        foreach (var param in sortedParams)
        {
            paramString.Append($"{param.Key}={param.Value}");
        }
        paramString.Append(sessionSecretKey);

        using (MD5 md5 = MD5.Create())
        {
            byte[] inputBytes = Encoding.UTF8.GetBytes(paramString.ToString());
            byte[] hashBytes = md5.ComputeHash(inputBytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}