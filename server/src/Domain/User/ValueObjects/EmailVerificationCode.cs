using Domain.Common;

namespace Domain.User.ValueObjects;

public class EmailVerificationCode : ValueObject
{
    public int Value { get; private set; } = GetRandom5DigitNumber();
    public DateTime ExpiryTime { get; private set; } = DateTime.UtcNow.AddDays(1);
    public bool IsExpired => DateTime.UtcNow > ExpiryTime;

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
