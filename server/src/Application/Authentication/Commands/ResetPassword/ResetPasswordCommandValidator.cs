using Application.Common.FluentValidation;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentValidation;

namespace Application.Authentication.Commands.ResetPassword;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.TokenString).MustBeGuid(Errors.RestorePasswordToken.Incorrect);
        RuleFor(x => x.Password).MustBeOk(Password.Create);
    }
}
