using System.Text.RegularExpressions;
using Domain.DomainErrors;
using XResults;

namespace Domain.User.ValueObjects;

public class Email
{
    public string Value { get; }
    public int UserId { get; private set; }

    private Email(string value)
    {
        Value = value;
    }

    public static Result<Email, Error> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Errors.Generic.IsRequired(nameof(Email), input);
        }

        string email = input.Trim().ToLower();
        if (email.Length > 150)
        {
            return Errors.Generic.TooLong(nameof(Email), email.Length);
        }

        if (!Regex.IsMatch(email, @"^[^@]+@[^@]+\.[^@]+$"))
        {
            return Errors.Email.IncorrectSignature(email);
        }

        return new Email(email);
    }
}
