using Domain.Common;

namespace Domain.User.ValueObjects;

public class AuthType : ValueObject
{
    public static AuthType Standard => new("Standard");
    public static AuthType Apple => new("Apple");
    public static AuthType Vk => new("Vk");
    public static AuthType Google => new("Google");

    public string Value { get; }

    private AuthType() { }

    private AuthType(string value)
    {
        Value = value;
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
    }
}
