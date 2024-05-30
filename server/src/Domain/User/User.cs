using Domain.Common;
using Domain.Common.Preconditions;
using Domain.DateTimeProviders;
using Domain.User.ValueObjects;

namespace Domain.User;

public class User : AggregateRoot<UserId>
{
    public Login? Login { get; set; }
    public Email Email { get; private set; }
    public Password? Password { get; set; }
    public Role Role { get; } = Role.User;
    public IReadOnlyList<RefreshToken> RefreshTokens => _refreshTokens;
    private readonly List<RefreshToken> _refreshTokens = [];
    public EmailVerificationCode? EmailVerificationCode { get; set; }
    public PhoneNumber? PhoneNumber { get; private set; }
    public PhoneNumberVerificationCode? PhoneNumberVerificationCode { get; set; }
    public bool IsEmailVerified { get; private set; }
    public bool IsPhoneNumberVerified { get; private set; }
    public PasswordResetToken? PasswordResetToken { get; set; }
    public AuthType AuthType { get; private set; }

    private User() // Constructor required by ef core
        : base(new UserId()) { }

    private User(UserId? id)
        : base(id ?? new UserId()) { }

    public static User CreateSocialAuthUser(Email email, AuthType authType, UserId? id = null)
    {
        Precondition.Requires(authType != AuthType.Standard);

        User user = new User(id ?? new UserId())
        {
            Email = email,
            AuthType = authType,
            IsEmailVerified = true
        };

        return user;
    }

    public static User CreateStandardAuthUser(
        Login login,
        Email email,
        Password password,
        EmailVerificationCode emailVerificationCode,
        UserId? id = null
    )
    {
        User user = new User(id)
        {
            Login = login,
            Password = password,
            EmailVerificationCode = emailVerificationCode,
            Email = email,
            AuthType = AuthType.Standard
        };

        return user;
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

    public void VerifyEmail()
    {
        IsEmailVerified = true;
        EmailVerificationCode = null;
    }

    public void AddUnverifiedPhoneNumber(PhoneNumber phoneNumber)
    {
        PhoneNumber = phoneNumber;
        PhoneNumberVerificationCode = new PhoneNumberVerificationCode(new DateTimeProvider());
    }

    public void VerifyPhoneNumber()
    {
        IsPhoneNumberVerified = true;
        PhoneNumberVerificationCode = null;
    }

    public void ClearPhoneNumber()
    {
        PhoneNumber = null;
    }
}
