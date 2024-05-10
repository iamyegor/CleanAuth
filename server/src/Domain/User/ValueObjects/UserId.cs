using Domain.Common;

namespace Domain.User.ValueObjects;

public class UserId : ValueObject
{
    public Guid Value { get; }

    public UserId()
    {
        Value = Guid.NewGuid();
    }

    public UserId(Guid value)
    {
        Value = value;
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
    }
}
