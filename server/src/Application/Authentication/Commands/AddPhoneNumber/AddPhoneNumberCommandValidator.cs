using Application.Common.FluentValidation;
using Domain.User.ValueObjects;
using FluentValidation;

namespace Application.Authentication.Commands.AddPhoneNumber;

public class AddPhoneNumberCommandValidator : AbstractValidator<AddPhoneNumberCommand>
{
    public AddPhoneNumberCommandValidator()
    {
        RuleFor(x => x.PhoneNumber).MustBeOk(PhoneNumber.Create);
    }
}
