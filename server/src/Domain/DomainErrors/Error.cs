using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Domain.DomainErrors;

public class Error
{
    public string Code { get; set; }
    public string Message { get; set; }
    public IDictionary<string, object?>? Details { get; set; }

    public Error(string code, string message, IDictionary<string, object?>? details = null)
    {
        Code = code;
        Message = message;
        Details = details;
    }

    public string Serialize()
    {
        var jsonSettings = new JsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        return JsonConvert.SerializeObject(this, jsonSettings);
    }

    public static Error Deserialize(string serialized)
    {
        Error? error = JsonConvert.DeserializeObject<Error>(serialized);
        if (error == null)
        {
            throw new Exception($"Can' deserialize error: {serialized}");
        }

        return error;
    }
}
