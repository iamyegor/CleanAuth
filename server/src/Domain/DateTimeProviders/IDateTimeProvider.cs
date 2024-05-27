namespace Domain.DateTimeProviders;

public interface IDateTimeProvider
{
    DateTime Now { get; }
}