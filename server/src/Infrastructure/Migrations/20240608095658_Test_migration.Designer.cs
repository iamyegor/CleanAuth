﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20240608095658_Test_migration")]
    partial class Test_migration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.User.User", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<bool>("IsEmailVerified")
                        .HasColumnType("boolean")
                        .HasColumnName("is_email_verified");

                    b.Property<bool>("IsPhoneNumberVerified")
                        .HasColumnType("boolean")
                        .HasColumnName("is_phone_number_verified");

                    b.Property<string>("OdnoklassnikiUserId")
                        .HasColumnType("text")
                        .HasColumnName("odnoklassniki_user_id");

                    b.Property<string>("TestProperty")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("VkUserId")
                        .HasColumnType("text")
                        .HasColumnName("vk_user_id");

                    b.ComplexProperty<Dictionary<string, object>>("Role", "Domain.User.User.Role#Role", b1 =>
                        {
                            b1.IsRequired();

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("role");
                        });

                    b.HasKey("Id");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("Domain.User.User", b =>
                {
                    b.OwnsOne("Domain.User.ValueObjects.Email", "Email", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("email");

                            b1.HasKey("UserId");

                            b1.HasIndex("Value")
                                .IsUnique();

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("Domain.User.ValueObjects.EmailVerificationCode", "EmailVerificationCode", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<DateTime>("ExpiryTime")
                                .HasColumnType("timestamp with time zone")
                                .HasColumnName("email_verification_code_expiry_time");

                            b1.Property<int>("Value")
                                .HasColumnType("integer")
                                .HasColumnName("email_verification_code");

                            b1.HasKey("UserId");

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("Domain.User.ValueObjects.Login", "Login", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("login");

                            b1.HasKey("UserId");

                            b1.HasIndex("Value")
                                .IsUnique();

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("Domain.User.ValueObjects.Password", "Password", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<string>("HashedPassword")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("password");

                            b1.HasKey("UserId");

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("Domain.User.ValueObjects.PasswordResetToken", "PasswordResetToken", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<DateTime>("ExpiryTime")
                                .HasColumnType("timestamp with time zone")
                                .HasColumnName("password_reset_token_expiry_time");

                            b1.Property<Guid>("Value")
                                .HasColumnType("uuid")
                                .HasColumnName("password_reset_token");

                            b1.HasKey("UserId");

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("Domain.User.ValueObjects.PhoneNumber", "PhoneNumber", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("phone_number");

                            b1.HasKey("UserId");

                            b1.HasIndex("Value")
                                .IsUnique();

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsOne("Domain.User.ValueObjects.PhoneNumberVerificationCode", "PhoneNumberVerificationCode", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("uuid");

                            b1.Property<DateTime>("ExpiryTime")
                                .HasColumnType("timestamp with time zone")
                                .HasColumnName("phone_number_verification_code_expiry_time");

                            b1.Property<int>("Value")
                                .HasColumnType("integer")
                                .HasColumnName("phone_number_verification_code");

                            b1.HasKey("UserId");

                            b1.ToTable("users");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.OwnsMany("Domain.User.ValueObjects.RefreshToken", "RefreshTokens", b1 =>
                        {
                            b1.Property<int>("id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("integer")
                                .HasColumnName("id");

                            NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b1.Property<int>("id"));

                            b1.Property<Guid>("DeviceId")
                                .HasColumnType("uuid")
                                .HasColumnName("device_id");

                            b1.Property<DateTime>("ExpiryTime")
                                .HasColumnType("timestamp with time zone")
                                .HasColumnName("refresh_token_expiry_time");

                            b1.Property<string>("Value")
                                .IsRequired()
                                .HasColumnType("text")
                                .HasColumnName("refresh_token");

                            b1.Property<Guid>("user_id")
                                .HasColumnType("uuid");

                            b1.HasKey("id");

                            b1.HasIndex("user_id");

                            b1.ToTable("refresh_tokens", (string)null);

                            b1.WithOwner()
                                .HasForeignKey("user_id");
                        });

                    b.Navigation("Email");

                    b.Navigation("EmailVerificationCode");

                    b.Navigation("Login");

                    b.Navigation("Password");

                    b.Navigation("PasswordResetToken");

                    b.Navigation("PhoneNumber");

                    b.Navigation("PhoneNumberVerificationCode");

                    b.Navigation("RefreshTokens");
                });
#pragma warning restore 612, 618
        }
    }
}
