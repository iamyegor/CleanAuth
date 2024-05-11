using Domain.Common;

namespace Domain.User.ValueObjects;

public class PasswordResetToken : ValueObject
{
    public Guid Value { get; } = new Guid();
    public DateTime ExpiryTime { get; } = DateTime.UtcNow.AddMinutes(30);
    public bool IsExpired => ExpiryTime < DateTime.UtcNow;

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
        yield return ExpiryTime;
    }
}
