using Ardalis.GuardClauses;
using Domain.Common;
using GuardClauses;

namespace Domain.User.ValueObjects;

public class RefreshToken : ValueObject
{
    public string Value { get; private set; }
    public DateTime ExpiryTime { get; private set; }
    public bool IsExpired => DateTime.UtcNow > ExpiryTime;

    public RefreshToken(string value)
    {
        Value = Guard.Against.InvalidRefreshToken(value);
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
