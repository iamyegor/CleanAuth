using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentAssertions;
using XResults;

namespace Domain.UnitTests;

public class PhoneNumberTests
{
    [Fact]
    public void Can_not_create_empty_phone_number()
    {
        Result<PhoneNumber, Error> result = PhoneNumber.Create("");

        result.Error.Should().Be(Errors.PhoneNumber.IsRequired());
    }

    [Fact]
    public void Can_not_create_phone_number_with_length_more_than_15()
    {
        string input = "+1234567890123456"; // 16 characters
        Result<PhoneNumber, Error> result = PhoneNumber.Create(input);

        result.Error.Should().Be(Errors.PhoneNumber.IsTooLong(input));
    }

    [Fact]
    public void Can_not_create_phone_number_with_invalid_signature()
    {
        string input = "123456"; // Invalid signature, no '+'
        Result<PhoneNumber, Error> result = PhoneNumber.Create(input);

        result.Error.Should().Be(Errors.PhoneNumber.HasInvalidSignature(input));
    }

    [Fact]
    public void Creates_phone_number()
    {
        string input = "+123456789012";
        Result<PhoneNumber, Error> result = PhoneNumber.Create(input);

        PhoneNumber phoneNumber = result.Value;
        phoneNumber.Value.Should().Be(input);
    }
}
