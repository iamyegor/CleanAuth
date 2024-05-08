using Domain.Common;

namespace Domain.User.ValueObjects;

public class Role : ValueObject
{
    public static Role User = new Role("User");
    public static Role Admin = new Role("Admin");
    
    public string Value { get; set; }

    private Role(string value)
    {
        Value = value;
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
    }
}
