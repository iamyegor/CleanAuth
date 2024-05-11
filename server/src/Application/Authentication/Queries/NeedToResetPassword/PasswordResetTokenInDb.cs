namespace Application.Authentication.Queries.NeedToResetPassword;

public class PasswordResetTokenInDb
{
    public string Token { get; set; } = null!;
    public DateTime ExpiryTime { get; set; }
}
