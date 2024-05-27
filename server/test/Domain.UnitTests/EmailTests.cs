using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentAssertions;
using XResults;

namespace Domain.UnitTests;

public class EmailTests
{
    [Fact]
    public void Can_not_create_empty_email()
    {
        Result<Email, Error> result = Email.Create("");

        result.Error.Should().Be(Errors.Email.IsRequired());
    }

    [Fact]
    public void Can_not_create_email_with_length_more_than_150()
    {
        string input = new string('a', 151);
        Result<Email, Error> result = Email.Create(input);

        result.Error.Should().Be(Errors.Email.IsTooLong(input));
    }

    [Fact]
    public void Can_not_create_email_with_invalid_signature()
    {
        Result<Email, Error> result = Email.Create("invalid-email");

        result.Error.Should().Be(Errors.Email.HasInvalidSignature("invalid-email"));
    }

    [Fact]
    public void Creates_email()
    {
        Result<Email, Error> result = Email.Create("yegor@gmail.com");

        Email email = result.Value;
        email.Value.Should().Be("yegor@gmail.com");
    }
}
