using Domain.User;
using Domain.User.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Cofigurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users").HasKey(x => x.Id);
        builder.Property(x => x.IsEmailVerified).HasColumnName("is_email_verified");
        builder.Property(x => x.IsPhoneNumberVerified).HasColumnName("is_phone_number_verified");

        builder
            .Property(u => u.Id)
            .HasColumnName("id")
            .HasConversion(id => id.Value, guid => new UserId(guid))
            .ValueGeneratedNever();

        builder.OwnsOne(
            x => x.Login,
            loginBuilder =>
            {
                loginBuilder.Property(l => l.Value).HasColumnName("login");
                loginBuilder.HasIndex(l => l.Value).IsUnique();
            }
        );

        builder.OwnsOne(
            x => x.Email,
            emailBuilder =>
            {
                emailBuilder.HasIndex(l => l.Value).IsUnique();
                emailBuilder.Property(e => e.Value).HasColumnName("email");
            }
        );

        builder.ComplexProperty(
            x => x.Password,
            passwordBuilder =>
            {
                passwordBuilder.Property(p => p.HashedPassword).HasColumnName("password");
            }
        );

        builder.ComplexProperty(
            x => x.Role,
            roleBuilder =>
            {
                roleBuilder.Property(r => r.Value).HasColumnName("role");
            }
        );

        builder.OwnsOne(
            x => x.RefreshToken,
            refreshTokenBuilder =>
            {
                refreshTokenBuilder.Property(r => r.Value).HasColumnName("refresh_token");
                refreshTokenBuilder
                    .Property(r => r.ExpiryTime)
                    .HasColumnName("refresh_token_expiry_time");
            }
        );

        builder.OwnsOne(
            x => x.EmailVerificationCode,
            tokenBuilder =>
            {
                tokenBuilder.Property(e => e.Value).HasColumnName("email_verification_code");
                tokenBuilder
                    .Property(e => e.ExpiryTime)
                    .HasColumnName("email_verification_code_expiry_time");
            }
        );

        builder.OwnsOne(
            x => x.PhoneNumber,
            phoneBuilder =>
            {
                phoneBuilder.Property(p => p.Value).HasColumnName("phone_number");
                phoneBuilder.HasIndex(p => p.Value).IsUnique();
            }
        );

        builder.OwnsOne(
            x => x.PhoneNumberVerificationCode,
            codeBuilder =>
            {
                codeBuilder.Property(c => c.Value).HasColumnName("phone_number_verification_code");
                codeBuilder
                    .Property(c => c.ExpiryTime)
                    .HasColumnName("phone_number_verification_code_expiry_time");
            }
        );

        builder.OwnsOne(
            x => x.PasswordResetToken,
            tokenBuilder =>
            {
                tokenBuilder.Property(t => t.Value).HasColumnName("password_reset_token");
                tokenBuilder
                    .Property(t => t.ExpiryTime)
                    .HasColumnName("password_reset_token_expiry_time");
            }
        );
    }
}
