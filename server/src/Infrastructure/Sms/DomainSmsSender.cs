namespace Infrastructure.Sms;

public class DomainSmsSender
{
    private readonly ISmsMessageBus _smsSender;

    public DomainSmsSender(ISmsMessageBus smsSender)
    {
        _smsSender = smsSender;
    }

    public async Task SendAsync(string toPhoneNumber, int verificationCode)
    {
        string message = $"Your verification code - {verificationCode}";
        await _smsSender.SendAsync(toPhoneNumber, message);
    }
}
