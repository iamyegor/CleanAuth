using Api.Dtos;
using Application.Authentication.Commands.Signup;
using Mapster;

namespace Api.Mappings;

public class SignUpCommandMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<(SignupDto dto, string? deviceId), SignUpCommand>()
            .Map(dest => dest.DeviceId, src => src.deviceId)
            .Map(dest => dest.Email, src => src.dto.Email)
            .Map(dest => dest.Login, src => src.dto.Login)
            .Map(dest => dest.Password, src => src.dto.Password);
    }
}
