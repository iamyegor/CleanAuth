using Domain.Common;
using Domain.DateTimeProviders;
using Domain.User.ValueObjects;

namespace Domain.User;

public class User : AggregateRoot<UserId>
{
    public Login? Login { get; set; }
    public Email? Email { get; set; }
    public Password? Password { get; set; }
    public Role Role { get; } = Role.User;
    public IReadOnlyList<RefreshToken> RefreshTokens => _refreshTokens;
    private readonly List<RefreshToken> _refreshTokens = [];
    public EmailVerificationCode? EmailVerificationCode { get; private set; }
    public PhoneNumber? PhoneNumber { get; private set; }
    public PhoneNumberVerificationCode? PhoneNumberVerificationCode { get; set; }
    public bool IsEmailVerified { get; private set; }
    public bool IsPhoneNumberVerified { get; private set; }
    public PasswordResetToken? PasswordResetToken { get; set; }
    public string? VkUserId { get; private set; }
    public bool IsVerified => IsEmailVerified && IsPhoneNumberVerified;

    private User() // Constructor required by ef core
        : base(new UserId()) { }

    private User(UserId? id)
        : base(id ?? new UserId()) { }

    public static User CreateGoogleUser(Email email)
    {
        User user = new User(new UserId())
        {
            Email = email,
            IsEmailVerified = true,
        };

        return user;
    }

    public static User CreateVkUser(string socialProviderUserId, UserId? id = null)
    {
        User user = new User(id ?? new UserId())
        {
            VkUserId = socialProviderUserId
        };

        return user;
    }

    public static User CreateStandardAuthUser(
        Login login,
        Email email,
        Password password,
        UserId? id = null
    )
    {
        User user = new User(id)
        {
            Login = login,
            Password = password,
            Email = email,
        };

        user.NewEmailVerificationCode();

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

    public void NewEmailVerificationCode(IDateTimeProvider? dateTimeProvider = null)
    {
        EmailVerificationCode = new EmailVerificationCode(
            dateTimeProvider ?? new DateTimeProvider()
        );
    }
}
