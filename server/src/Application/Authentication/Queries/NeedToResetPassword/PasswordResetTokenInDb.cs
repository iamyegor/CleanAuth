namespace Application.Authentication.Queries.NeedToResetPassword;

public class PasswordResetTokenInDb
{
    public Guid PasswordResetToken { get; set; }
    public DateTime PasswordResetTokenExpiryTime { get; set; }
}
