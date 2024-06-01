using System.Reflection;

namespace Infrastructure.Emails;

public class DomainEmailSender : IDomainEmailSender
{
    private readonly EmailMessageBus _emailMessageBus;
    private readonly string _htmlFolderPath = Path.Combine(
        Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!,
        "Emails",
        "ui"
    );

    public DomainEmailSender(EmailMessageBus emailMessageBus)
    {
        _emailMessageBus = emailMessageBus;
    }

    public async Task SendEmailVerificationCode(string email, int code)
    {
        string htmlContent = await File.ReadAllTextAsync(
            Path.Combine(_htmlFolderPath, "email.html")
        );

        string emailBody = string.Format(htmlContent, code);
        await _emailMessageBus.SendAsync(emailBody, email);
    }

    public async Task SendPasswordReset(Guid userId, Guid token, string email)
    {
        string htmlContent = await File.ReadAllTextAsync(
            Path.Combine(_htmlFolderPath, "password-reset.html")
        );

        string emailBody = string.Format(htmlContent, "http://localhost:80/", userId, token);
        await _emailMessageBus.SendAsync(emailBody, email);
    }
}
