using Domain.User;
using FluentAssertions;

namespace Application.IntegrationTests.CustomAssertions;

public static class UserAssertionsExtensions
{
    public static User ShouldHaveEmail(this User user, string email)
    {
        user.Email.Value.Should().Be(email);
        return user;
    }

    public static User ShouldHavePassword(this User user, string password)
    {
        user.Password.Matches(password).Should().BeTrue();
        return user;
    }

    public static User ShouldHaveEmailVerificationCode(this User user)
    {
        user.EmailVerificationCode.Should().NotBeNull();
        return user;
    }

    public static User ShouldHaveOneRefreshToken(
        this User user,
        string refreshToken,
        string deviceId
    )
    {
        user.RefreshTokens.Should().ContainSingle();
        user.RefreshTokens[0].Value.Should().Be(refreshToken);
        user.RefreshTokens[0].DeviceId.Should().Be(deviceId);

        return user;
    }

    public static User ShouldNotHavePasswordResetToken(this User user)
    {
        user.PasswordResetToken.Should().BeNull();
        return user;
    }

    public static User ShouldHavePasswordResetToken(this User user)
    {
        user.PasswordResetToken.Should().NotBeNull();
        return user;
    }

    public static User ShouldHavePhoneNumberVerificationCode(this User user)
    {
        user.PhoneNumberVerificationCode.Should().NotBeNull();
        return user;
    }

    public static User ShouldHavePhoneNumber(this User user, string phoneNumber)
    {
        user.PhoneNumber!.Value.Should().Be(phoneNumber);
        return user;
    }

    public static User ShouldNotHavePhoneNumber(this User user)
    {
        user.PhoneNumber.Should().BeNull();
        return user;
    }

    public static User ShouldHaveVerifiedEmail(this User user)
    {
        user.IsEmailVerified.Should().BeTrue();
        return user;
    }

    public static User ShouldNotHaveEmailVerificationCode(this User user)
    {
        user.EmailVerificationCode.Should().BeNull();
        return user;
    }

    public static User ShouldHaveVerifiedPhoneNumber(this User user)
    {
        user.IsPhoneNumberVerified.Should().BeTrue();
        return user;
    }

    public static User ShouldNotHavePhoneNumberVerificationCode(this User user)
    {
        user.PhoneNumberVerificationCode.Should().BeNull();
        return user;
    }

    public static User ShouldHaveLogin(this User user, string login)
    {
        user.Login.Should().NotBeNull();
        user.Login!.Value.Should().Be(login);

        return user;
    }

    public static User ShouldNotHaveLogin(this User user)
    {
        user.Login.Should().BeNull();
        return user;
    }

    public static User ShouldNotHavePassword(this User user)
    {
        user.Password.Should().BeNull();
        return user;
    }
}
