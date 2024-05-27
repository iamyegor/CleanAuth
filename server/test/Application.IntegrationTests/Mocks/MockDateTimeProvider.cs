using Domain.DateTimeProviders;

namespace Application.IntegrationTests.Mocks;

public class MockDateTimeProvider : IDateTimeProvider
{
    public DateTime Now { get; }

    public MockDateTimeProvider(DateTime now)
    {
        Now = now;
    }

    public MockDateTimeProvider()
    {
        Now = DateTime.UtcNow;
    }

    public static MockDateTimeProvider CreateExpiredProvider =>
        new MockDateTimeProvider(new DateTime(1999, 12, 12, 12, 12, 12, DateTimeKind.Utc));
}
