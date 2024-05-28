using Application.Common.FluentValidation;
using FluentValidation;

namespace Application.Authentication.Commands.LogIn;

public class LogInCommandValidator : AbstractValidator<LogInCommand>
{
    public LogInCommandValidator()
    {
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
    }
}
