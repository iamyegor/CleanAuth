using System.Text.RegularExpressions;
using Domain.Common;
using Domain.DomainErrors;
using XResults;

namespace Domain.User.ValueObjects;

public class Email : ValueObject
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Result<Email, Error> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Errors.Email.IsRequired();
        }

        string email = input.Trim().ToLower();
        if (email.Length > 150)
        {
            return Errors.Email.IsTooLong(email);
        }

        if (!Regex.IsMatch(email, @"^[^@]+@[^@]+\.[^@]+$"))
        {
            return Errors.Email.HasInvalidSignature(email);
        }

        return new Email(email);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
    }
}
