using Domain.Common;
using Domain.User.ValueObjects;

namespace Domain.User;

public class User : Entity<int>
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

    private User()
        : base(0) { }

    public User(
        Login login,
        Email email,
        Password password,
        EmailVerificationCode emailVerificationCode,
        int id = 0
    )
        : base(id)
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
}
