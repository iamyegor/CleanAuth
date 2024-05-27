using Domain.Common;
using Domain.DateTimeProviders;

namespace Domain.User.ValueObjects;

public class PasswordResetToken : ValueObject
{
    public Guid Value { get; } = Guid.NewGuid();
    public DateTime ExpiryTime { get; }
    public bool IsExpired => ExpiryTime < DateTime.UtcNow;

    private PasswordResetToken() { }

    public PasswordResetToken(IDateTimeProvider dateTimeProvider)
    {
        ExpiryTime = dateTimeProvider.Now.AddMinutes(30);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
        yield return ExpiryTime;
    }
}
