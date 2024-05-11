using Ardalis.GuardClauses;
using Domain.Common;
using Domain.User.ValueObjects;
using GuardClauses;

namespace Domain.User;

public class User : Entity<UserId>
{
    public Login Login { get; private set; }
    public Email Email { get; private set; }
    public Password Password { get; }
    public Role Role { get; } = Role.User;
    public RefreshToken? RefreshToken { get; set; }
    public EmailVerificationCode? EmailVerificationCode { get; set; }
    public PhoneNumber? PhoneNumber { get; set; }
    public PhoneNumberVerificationCode? PhoneNumberVerificationCode { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneNumberVerified { get; set; }
    public PasswordResetToken? PasswordResetToken { get; private set; }

    private User()
        : base(new UserId()) { }

    public User(
        Login login,
        Email email,
        Password password,
        EmailVerificationCode emailVerificationCode,
        UserId? id = null
    )
        : base(id ?? new UserId())
    {
        Login = login;
        Password = password;
        EmailVerificationCode = emailVerificationCode;
        Email = email;
    }

    public void SetRefreshToken(RefreshToken refreshToken)
    {
        RefreshToken = refreshToken;
    }

    public void SetPasswordResetToken(PasswordResetToken token)
    {
        Guard.Against.False(IsPhoneNumberVerified);
        Guard.Against.False(IsEmailVerified);
        
        PasswordResetToken = token;
    }
}
