using Application.Common.FluentValidation;
using Domain.DomainErrors;
using FluentValidation;

namespace Application.Authentication.Queries.NeedToResetPassword;

public class NeedToResetPasswordQueryValidator : AbstractValidator<NeedToResetPasswordQuery>
{
    public NeedToResetPasswordQueryValidator()
    {
        RuleFor(x => x.UserId).MustBeGuid(Errors.UserId.IsInvalid);
        RuleFor(x => x.Token).MustBeGuid(Errors.PasswordResetToken.IsInvalid);
    }
}
