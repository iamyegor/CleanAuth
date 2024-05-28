namespace Domain.DomainErrors;

public static partial class Errors
{
    public static class DeviceId
    {
        public static Error IsInvalid(string? value)
        {
            var details = new Dictionary<string, object?>() { ["deviceId"] = value };
            return new Error("device.id.invalid", "Device id is invalid", details);
        }
    }
}
