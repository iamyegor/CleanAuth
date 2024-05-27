using System.Security.Cryptography;
using System.Text;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentAssertions;
using XResults;

namespace Domain.UnitTests;

public class PasswordTests
{

    [Fact]
    public void Can_not_create_empty_password()
    {
        Result<Password, Error> result = Password.Create("");

        result.Error.Should().Be(Errors.Password.IsRequired());
    }

    [Fact]
    public void Can_not_create_password_with_length_less_than_6()
    {
        string input = "12345";
        Result<Password, Error> result = Password.Create(input);

        result.Error.Should().Be(Errors.Password.HasInvalidLength(input));
    }

    [Fact]
    public void Can_not_create_password_with_length_more_than_50()
    {
        string input = new string('a', 51);
        Result<Password, Error> result = Password.Create(input);

        result.Error.Should().Be(Errors.Password.HasInvalidLength(input));
    }

    [Fact]
    public void Can_not_create_password_with_invalid_signature()
    {
        string input = "password";
        Result<Password, Error> result = Password.Create(input);

        result.Error.Should().Be(Errors.Password.HasInvalidSignature(input));
    }

    [Fact]
    public void Creates_password()
    {
        string input = "Valid1Password!";
        Result<Password, Error> result = Password.Create(input);

        Password password = result.Value;
        string expectedHashedPassword = Convert.ToHexString(
            SHA512.Create().ComputeHash(Encoding.UTF8.GetBytes(input))
        );

        password.HashedPassword.Should().Be(expectedHashedPassword);
    }

    [Fact]
    public void Two_identical_passwords_match()
    {
        string input = "Valid1Password!";
        Result<Password, Error> result = Password.Create(input);
        Password password = result.Value;

        bool matches = password.Matches(input);
        matches.Should().BeTrue();
    }

    [Fact]
    public void Two_different_passwords_do_not_match()
    {
        string input = "Valid1Password!";
        Result<Password, Error> result = Password.Create(input);
        Password password = result.Value;

        bool matches = password.Matches("WrongPassword!");
        matches.Should().BeFalse();
    }
}
