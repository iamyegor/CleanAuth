using Api.Dtos;
using Application.Authentication.Commands.LogIn;
using Mapster;

namespace Api.Mappings;

public class LogInCommandMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<(LoginDto dto, string? deviceId), LogInCommand>()
            .Map(dest => dest.DeviceId, src => src.deviceId)
            .Map(dest => dest.LoginOrEmail, src => src.dto.LoginOrEmail)
            .Map(dest => dest.Password, src => src.dto.Password);
    }
}
