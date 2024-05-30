using Application.Common.FluentValidation;
using FluentValidation;

namespace Application.SocialAuthentication.Command.SingInWithGoogle;

public class SignInWithGoogleCommandValidator : AbstractValidator<SignInWithGoogleCommand>
{
    public SignInWithGoogleCommandValidator()
    {
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
    }
}
