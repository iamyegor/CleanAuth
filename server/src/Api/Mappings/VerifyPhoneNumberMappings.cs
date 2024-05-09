using Api.Dtos;
using Application.Authentication.Commands.VerifyPhoneNumber;
using Mapster;

namespace Api.Mappings;

public class VerifyPhoneNumberMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<(int userId, VerifyPhoneNumberDto dto), VerifyPhoneNumberCommand>()
            .Map(dest => dest.UserId, src => src.userId)
            .Map(dest => dest.Code, src => src.dto.Code);
    }
}
