using System.Text.RegularExpressions;
using Domain.Common;
using Domain.DomainErrors;
using XResults;

namespace Domain.User.ValueObjects;

public class PhoneNumber : ValueObject
{
    public string Value { get; }

    private PhoneNumber() { }

    private PhoneNumber(string value)
    {
        Value = value;
    }

    public static Result<PhoneNumber, Error> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Errors.PhoneNumber.IsRequired();
        }

        string phoneNumber = input.Trim();
        if (phoneNumber.Length > 15)
        {
            return Errors.PhoneNumber.IsTooLong(phoneNumber);
        }

        if (!Regex.IsMatch(phoneNumber, @"^\+\d{10,15}$"))
        {
            return Errors.PhoneNumber.HasInvalidSignature(phoneNumber);
        }

        return new PhoneNumber(phoneNumber);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
    }
}
