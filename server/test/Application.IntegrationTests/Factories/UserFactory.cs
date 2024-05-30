using Application.IntegrationTests.Base;
using Application.IntegrationTests.Mocks;
using Domain.User;
using Domain.User.ValueObjects;

namespace Application.IntegrationTests.Factories;

public class UserFactory
{
    public async Task<User> CreateSocialUserAsync(
        AuthType authType,
        string email = "yegor@google.com",
        string? login = null,
        bool isPhoneNumberVerified = false
    )
    {
        User user = User.CreateSocialAuthUser(Email.Create(email), authType);
        if (login != null)
        {
            user.Login = Login.Create(login);
        }

        if (isPhoneNumberVerified)
        {
            user.VerifyPhoneNumber();
        }

        await SaveUserAsync(user);

        return user;
    }

    public async Task<User> CreateAsync(
        string login = "yegor",
        string email = "yegor@google.com",
        string password = "PasswordA123",
        bool isEmailVerified = true,
        bool isPhoneNumberVerified = true,
        PasswordResetToken? passwordResetToken = null,
        PhoneNumberVerificationCode? phoneNumberVerificationCode = null,
        string? phoneNumber = null,
        EmailVerificationCode? emailVerificationCode = null,
        RefreshToken? refreshToken = null
    )
    {
        emailVerificationCode ??= new EmailVerificationCode(new MockDateTimeProvider());

        User user = User.CreateStandardAuthUser(
            Login.Create(login),
            Email.Create(email),
            Password.Create(password),
            emailVerificationCode
        );

        user.PasswordResetToken = passwordResetToken;
        user.PhoneNumberVerificationCode = phoneNumberVerificationCode;

        if (phoneNumber != null)
        {
            user.AddUnverifiedPhoneNumber(PhoneNumber.Create(phoneNumber));
        }

        if (isEmailVerified)
        {
            user.VerifyEmail();
        }

        if (isPhoneNumberVerified)
        {
            user.VerifyPhoneNumber();
        }

        if (refreshToken != null)
        {
            user.AddRefreshToken(refreshToken);
        }

        await SaveUserAsync(user);

        return user;
    }

    private async Task SaveUserAsync(User user)
    {
        await using (var context = DbContextProvider.Create())
        {
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }
    }
}
