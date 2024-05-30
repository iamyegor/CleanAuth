using Application.Common.FluentValidation;
using Domain.User.ValueObjects;
using FluentValidation;

namespace Application.Authentication.Commands.Signup;

public class SignUpCommandValidator : AbstractValidator<SignUpCommand>
{
    public SignUpCommandValidator()
    {
        RuleFor(x => x.Login).MustBeOk(Login.Create);
        RuleFor(x => x.Email).MustBeOk(Email.Create);
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
        RuleFor(x => x.Password).MustBeOk(Password.Create);
    }
}
