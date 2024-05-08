using System.Text.RegularExpressions;
using Domain.Common;
using Domain.DomainErrors;
using XResults;

namespace Domain.User.ValueObjects;

public class Login : ValueObject
{
    public string Value { get; private set; }
    public int UserId { get; private set; }

    private Login(string value)
    {
        Value = value;
    }

    public static Result<Login, Error> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Errors.Generic.IsRequired(nameof(Login), input);
        }

        string login = input.Trim();
        if (login.Length > 32)
        {
            return Errors.Generic.TooLong(nameof(Login), login.Length);
        }

        if (login.Length < 3)
        {
            return Errors.Generic.TooShort(nameof(Login), login.Length);
        }

        if (!Regex.IsMatch(login, "^[a-zA-Z0-9_]*$"))
        {
            return Errors.Login.InvalidSymbols(login);
        }

        return new Login(input);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
    }

    public bool Equals(string login)
    {
        return Value == login;
    }
}
