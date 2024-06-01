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
        builder.Property(x => x.VkUserId).HasColumnName("vk_user_id");
        builder.Property(x => x.OdnoklassnikiUserId).HasColumnName("odnoklassniki_user_id");

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
                emailBuilder.Property(e => e.Value).HasColumnName("email");
                emailBuilder.HasIndex(e => e.Value).IsUnique();
            }
        );

        builder.OwnsOne(
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

        builder.OwnsMany(
            x => x.RefreshTokens,
            refreshTokenBuilder =>
            {
                refreshTokenBuilder.Property<int>("id").HasColumnName("id");
                refreshTokenBuilder.HasKey("id");
                refreshTokenBuilder.ToTable("refresh_tokens");

                refreshTokenBuilder.WithOwner().HasForeignKey("user_id");
                refreshTokenBuilder.Property(r => r.Value).HasColumnName("refresh_token");
                refreshTokenBuilder.Property(r => r.DeviceId).HasColumnName("device_id");
                refreshTokenBuilder
                    .Property(r => r.ExpiryTime)
                    .HasColumnName("refresh_token_expiry_time");

                refreshTokenBuilder.WithOwner().HasForeignKey("user_id");
                refreshTokenBuilder.Property("user_id").IsRequired();
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
