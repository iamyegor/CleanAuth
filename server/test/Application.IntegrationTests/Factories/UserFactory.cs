using Application.IntegrationTests.Base;
using Application.IntegrationTests.Mocks;
using Domain.User;
using Domain.User.ValueObjects;

namespace Application.IntegrationTests.Factories;

public class UserFactory
{
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
        PhoneNumber? phoneNumberObj =
            phoneNumber != null ? PhoneNumber.Create(phoneNumber).Value : null;

        await using (var context = DbContextProvider.Create())
        {
            User user = new User(
                Login.Create(login),
                Email.Create(email),
                Password.Create(password),
                emailVerificationCode
            )
            {
                IsEmailVerified = isEmailVerified,
                IsPhoneNumberVerified = isPhoneNumberVerified,
                PasswordResetToken = passwordResetToken,
                PhoneNumberVerificationCode = phoneNumberVerificationCode,
                PhoneNumber = phoneNumberObj,
            };

            if (refreshToken != null)
            {
                user.AddRefreshToken(refreshToken);
            }

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            return user;
        }
    }
}
