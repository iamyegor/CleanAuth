using Application.Common.FluentValidation;
using FluentValidation;

namespace Application.Authentication.Commands.VerifyPhoneNumber;

public class VerifyPhoneNumberCommandValidator : AbstractValidator<VerifyPhoneNumberCommand>
{
    public VerifyPhoneNumberCommandValidator()
    {
        RuleFor(x => x.Code).MustHaveLength(4);
    }
}
