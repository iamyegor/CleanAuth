using Application.Common.FluentValidation;
using FluentValidation;

namespace Application.SocialAuthentication.Command.SignInWithVk;

public class SignInWithVkCommandValidator : AbstractValidator<SignInWithVkCommand>
{
    public SignInWithVkCommandValidator()
    {
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
    }
}