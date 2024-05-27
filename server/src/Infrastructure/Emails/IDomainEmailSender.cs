namespace Infrastructure.Emails;

public interface IDomainEmailSender
{
    public Task SendEmailVerificationCode(string email, int code);
    public Task SendPasswordReset(Guid userId, Guid token, string email);
}
