using Domain.Common;
using Domain.DateTimeProviders;

namespace Domain.User.ValueObjects;

public class EmailVerificationCode : ValueObject
{
    public int Value { get; private set; } = GetRandom5DigitNumber();
    public DateTime ExpiryTime { get; private set; }
    public bool IsExpired => DateTime.UtcNow > ExpiryTime;

    private EmailVerificationCode() { }

    public EmailVerificationCode(IDateTimeProvider dateTimeProvider)
    {
        ExpiryTime = dateTimeProvider.Now.AddDays(1);
    }

    protected override IEnumerable<object?> GetPropertiesForComparison()
    {
        yield return Value;
        yield return ExpiryTime;
    }

    private static int GetRandom5DigitNumber()
    {
        Random random = new Random();
        return random.Next(10000, 100000);
    }
}
