using Ardalis.GuardClauses;

namespace GuardClauses;

public static class FooGuard
{
    public static string InvalidRefreshToken(this IGuardClause guardClause, string? input)
    {
        Guard.Against.NullOrWhiteSpace(input);
        Guard.Against.LengthOutOfRange(input, 44, 44);

        return input;
    }
}
