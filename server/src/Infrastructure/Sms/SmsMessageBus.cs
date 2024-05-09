using Ardalis.GuardClauses;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Infrastructure.Sms;

public class SmsMessageBus
{
    private readonly string _fromPhoneNumber;

    public SmsMessageBus(IConfiguration configuration)
    {
        _fromPhoneNumber = Guard.Against.NullOrWhiteSpace(configuration["SenderPhoneNumber"]);
    }

    public void Send(string toPhoneNumber, string text)
    {
        string accountSid = Guard.Against.NullOrEmpty(
            Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID")
        );

        string authToken = Guard.Against.NullOrEmpty(
            Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN")
        );

        TwilioClient.Init(accountSid, authToken);

        MessageResource.Create(
            body: text,
            from: new Twilio.Types.PhoneNumber(_fromPhoneNumber),
            to: new Twilio.Types.PhoneNumber(toPhoneNumber)
        );
    }
}
