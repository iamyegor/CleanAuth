using Ardalis.GuardClauses;
using Domain.Common;
using GuardClauses;

namespace Domain.User.ValueObjects;

public class RefreshToken : ValueObject
{
    public string Value { get; private set; }
    public DateTime ExpiryTime { get; private set; }
    public bool IsExpired => DateTime.UtcNow > ExpiryTime;
    public Guid DeviceId { get; private set; }

    public RefreshToken(string value, Guid deviceId)
    {
        Value = Guard.Against.InvalidRefreshToken(value);
        ExpiryTime = DateTime.UtcNow.AddDays(7);
        DeviceId = deviceId;
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
