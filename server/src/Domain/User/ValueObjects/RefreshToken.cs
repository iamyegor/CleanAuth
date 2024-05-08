using Domain.Common;

namespace Domain.User.ValueObjects;

public class RefreshToken : ValueObject
{
    public string Value { get; private set; }
    public DateTime ExpiryTime { get; private set; }
    public bool IsExpired => DateTime.UtcNow > ExpiryTime;

    public RefreshToken(string value)
    {
        Value = value;
        ExpiryTime = DateTime.UtcNow.AddDays(7);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
        yield return ExpiryTime;
    }

    public bool Matches(string refreshToken)
    {
        return Value == refreshToken;
    }
}
