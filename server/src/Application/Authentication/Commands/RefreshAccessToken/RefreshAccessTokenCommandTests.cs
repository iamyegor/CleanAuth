using Application.Common.FluentValidation;
using Domain.DomainErrors;
using FluentValidation;

namespace Application.Authentication.Commands.RefreshAccessToken;

public class RefreshAccessTokenCommandTests : AbstractValidator<RefreshAccessTokenCommand>
{
    public RefreshAccessTokenCommandTests()
    {
        RuleFor(x => x.RefreshToken).MustNotBeEmpty(Errors.RefreshToken.IsRequired());
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
    }
}
