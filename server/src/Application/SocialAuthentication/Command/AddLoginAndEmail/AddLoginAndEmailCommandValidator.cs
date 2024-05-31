using Application.Common.FluentValidation;
using Domain.User.ValueObjects;
using FluentValidation;

namespace Application.SocialAuthentication.Command.AddLoginAndEmail;

public class AddLoginAndEmailCommandValidator : AbstractValidator<AddLoginAndEmailCommand>
{
    public AddLoginAndEmailCommandValidator()
    {
        RuleFor(x => x.Login).MustBeOk(Login.Create);
        RuleFor(x => x.Email).MustBeOk(Email.Create);
    }
}