namespace Infrastructure.Sms;

public interface ISmsMessageBus
{
    public Task SendAsync(string toPhoneNumber, string text);
}