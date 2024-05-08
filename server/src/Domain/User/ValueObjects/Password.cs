using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Domain.Common;
using Domain.DomainErrors;
using XResults;

namespace Domain.User.ValueObjects;

public class Password : ValueObject
{
    public string HashedPassword { get; }

    private Password(string hashedPassword)
    {
        HashedPassword = hashedPassword;
    }

    public static Result<Password, Error> Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Result.Fail(Errors.Generic.IsRequired(nameof(Password), input));
        }

        string password = input.Trim();
        if (password.Length < 6 || password.Length > 50)
        {
            return Result.Fail(Errors.Password.InvalidLength(password));
        }

        if (Regex.IsMatch(password, "^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\d\\W]).*$\n"))
        {
            return Result.Fail(Errors.Password.InvalidSignature(password));
        }

        string hashedPassword = Convert.ToHexString(
            SHA512.Create().ComputeHash(Encoding.UTF8.GetBytes(password))
        );

        return new Password(hashedPassword);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return HashedPassword;
    }

    public bool Matches(string password)
    {
        string hashedIncomingPassword = Convert.ToHexString(
            SHA512.Create().ComputeHash(Encoding.UTF8.GetBytes(password))
        );

        return HashedPassword == hashedIncomingPassword;
    }
}
