using Application.Common.FluentValidation;
using Domain.User.ValueObjects;
using FluentValidation;

namespace Application.SocialAuthentication.Command.AddLogin;

public class AddLoginCommandValidator : AbstractValidator<AddLoginCommand>
{
    public AddLoginCommandValidator()
    {
        RuleFor(x => x.Login).MustBeOk(Login.Create);
    }
}
