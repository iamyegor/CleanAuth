using System.Net;
using System.Net.Mail;
using System.Reflection;
using Domain.User.ValueObjects;
using Microsoft.Extensions.Options;

namespace Infrastructure.Emails;

public class MessageBus
{
    private readonly EmailSettings _emailSettings;

    public MessageBus(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public void SendEmailVerificationCode(Email email, EmailVerificationCode code)
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
            var htmlContent = File.ReadAllText(htmlPath);

            string emailBody = string.Format(htmlContent, code.Value);

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = "Your verification code",
                Body = emailBody,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email.Value);

            client.Send(mailMessage);
        }
    }
}
