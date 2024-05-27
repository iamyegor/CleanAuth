namespace Infrastructure.Sms;

public class VerificationCodeSender
{
    private readonly ISmsMessageBus _smsSender;

    public VerificationCodeSender(ISmsMessageBus smsSender)
    {
        _smsSender = smsSender;
    }

    public async Task SendAsync(string toPhoneNumber, int verificationCode)
    {
        string message = $"Your verification code - {verificationCode}";
        await _smsSender.SendAsync(toPhoneNumber, message);
    }
}
