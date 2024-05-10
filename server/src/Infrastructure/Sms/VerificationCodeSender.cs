namespace Infrastructure.Sms;

public class VerificationCodeSender
{
    private readonly SmsMessageBus _smsSender;

    public VerificationCodeSender(SmsMessageBus smsSender)
    {
        _smsSender = smsSender;
    }

    public async Task SendAsync(string toPhoneNumber, int verificationCode)
    {
        string message = $"Your verification code - {verificationCode}";
        await _smsSender.SendAsync(toPhoneNumber, message);
    }
}
