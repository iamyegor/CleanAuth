namespace Application.IntegrationTests.Factories;

public class DeviceIdFactory
{
    public string Create()
    {
        return Guid.NewGuid().ToString();
    }

    public string CreateInvalid()
    {
        return "invalid-guid";
    }

    public Guid CreateGuid()
    {
        return Guid.NewGuid();
    }
}
