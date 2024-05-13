using Application.Common.FluentValidation;
using Domain.DomainErrors;
using FluentValidation;

namespace Application.Authentication.Commands.VerifyEmail;

public class VerifyEmailCommandValidator : AbstractValidator<VerifyEmailCommand>
{
    public VerifyEmailCommandValidator()
    {
        RuleFor(x => x.Code).MustHaveLength(5, Errors.EmailVerificationCode.HasIncorrectLength);
    }
}
