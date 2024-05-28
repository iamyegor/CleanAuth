using Domain.Common;
using Domain.User.ValueObjects;

namespace Domain.User;

public class User : Entity<UserId>
{
    public Login Login { get; private set; }
    public Email Email { get; private set; }
    public Password Password { get; set; }
    public Role Role { get; } = Role.User;
    public IReadOnlyList<RefreshToken> RefreshTokens => _refreshTokens;
    private readonly List<RefreshToken> _refreshTokens = [];
    public EmailVerificationCode? EmailVerificationCode { get; set; }
    public PhoneNumber? PhoneNumber { get; set; }
    public PhoneNumberVerificationCode? PhoneNumberVerificationCode { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneNumberVerified { get; set; }
    public PasswordResetToken? PasswordResetToken { get; set; }

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

    public void AddRefreshToken(RefreshToken refreshToken)
    {
        _refreshTokens.RemoveAll(rt => rt.DeviceId == refreshToken.DeviceId);
        _refreshTokens.Add(refreshToken);
    }

    public bool IsRefreshTokenExpired(Guid deviceId)
    {
        return RefreshTokens.First(x => x.DeviceId == deviceId).IsExpired;
    }
}
