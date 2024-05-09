using Api.Dtos;
using Application.Authentication.Commands.AddPhoneNumber;
using Mapster;

namespace Api.Mappings;

public class AddPhoneNumberMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<(int userId, AddPhoneNumberDto dto), AddPhoneNumberCommand>()
            .Map(dest => dest.UserId, src => src.userId)
            .Map(dest => dest.PhoneNumber, src => src.dto.PhoneNumber);
    }
}
