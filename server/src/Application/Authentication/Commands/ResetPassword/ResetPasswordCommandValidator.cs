using Application.Common.FluentValidation;
using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentValidation;

namespace Application.Authentication.Commands.ResetPassword;

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.UserId).MustBeGuid(Errors.UserId.IsInvalid);
        RuleFor(x => x.TokenString).MustBeGuid(Errors.PasswordResetToken.IsInvalid);
        RuleFor(x => x.Password).MustBeOk(Password.Create);
    }
}
