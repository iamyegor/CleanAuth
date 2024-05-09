namespace Infrastructure.Sms;

public class VerificationCodeSender
{
    private readonly SmsMessageBus _smsSender;

    public VerificationCodeSender(SmsMessageBus smsSender)
    {
        _smsSender = smsSender;
    }

    public void Send(string toPhoneNumber, int verificationCode)
    {
        string message = $"Your verification code - {verificationCode}";
        _smsSender.Send(toPhoneNumber, message);
    }
}
