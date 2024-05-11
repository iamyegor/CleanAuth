using System.Net;
using System.Net.Mail;
using System.Reflection;
using Domain.User.ValueObjects;
using Microsoft.Extensions.Options;

namespace Infrastructure.Emails;

public class EmailMessageSender
{
    private readonly EmailSettings _emailSettings;

    public EmailMessageSender(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailVerificationCode(string email, int code)
    {
        using (var client = new SmtpClient(_emailSettings.MailServer, _emailSettings.MailPort))
        {
            client.Credentials = new NetworkCredential(
                _emailSettings.Username,
                _emailSettings.Password
            );
            client.EnableSsl = true;

            string basePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!;
            string htmlPath = Path.Combine(basePath, "Emails", "ui", "email.html");
            string htmlContent = await File.ReadAllTextAsync(htmlPath);

            string emailBody = string.Format(htmlContent, code);

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = "Your verification code",
                Body = emailBody,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }

    public void SendPasswordResetToken(PasswordResetToken token)
    {
        throw new NotImplementedException();
    }
}
