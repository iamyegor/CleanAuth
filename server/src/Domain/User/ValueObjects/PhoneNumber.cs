using System.Text.RegularExpressions;
using Domain.DomainErrors;
using XResults;

namespace Domain.User.ValueObjects;

public class PhoneNumber
{
    public string Value { get; }
    public int UserId { get; private set; }

    private PhoneNumber() { }

    private PhoneNumber(string value)
    {
        Value = value;
    }

    public static Result<PhoneNumber, Error> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Errors.Generic.IsRequired(nameof(PhoneNumber), input);
        }

        string phoneNumber = input.Trim();
        if (phoneNumber.Length > 20)
        {
            return Errors.Generic.TooLong(nameof(PhoneNumber), phoneNumber.Length);
        }

        if (!Regex.IsMatch(phoneNumber, @"^\+\d{10,15}$"))
        {
            return Errors.PhoneNumber.IncorrectSignature(phoneNumber);
        }

        return new PhoneNumber(phoneNumber);
    }
}
