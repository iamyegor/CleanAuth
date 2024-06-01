using Application.Common.FluentValidation;
using FluentValidation;

namespace Application.SocialAuthentication.Command.SignInWithOdnoklassniki;

public class SignInWithOdnoklassnikiCommandValidator
    : AbstractValidator<SignInWithOdnoklassnikiCommand>
{
    public SignInWithOdnoklassnikiCommandValidator()
    {
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
    }
}
