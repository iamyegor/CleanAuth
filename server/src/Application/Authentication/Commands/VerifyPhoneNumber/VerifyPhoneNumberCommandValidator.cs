using Application.Common.FluentValidation;
using Domain.DomainErrors;
using FluentValidation;

namespace Application.Authentication.Commands.VerifyPhoneNumber;

public class VerifyPhoneNumberCommandValidator : AbstractValidator<VerifyPhoneNumberCommand>
{
    public VerifyPhoneNumberCommandValidator()
    {
        RuleFor(x => x.Code).MustHaveLength(4, Errors.PhoneNumberVerificationCode.HasInvalidLength);
        RuleFor(x => x.DeviceId).MustBeValidDeviceId();
    }
}
