using Domain.DomainErrors;
using Domain.User.ValueObjects;
using FluentValidation;
using XResults;

namespace Application.Common.FluentValidation;

public static class CustomValidationRules
{
    public static IRuleBuilderOptionsConditions<T, int> MustHaveLength<T>(
        this IRuleBuilder<T, int> ruleBuilder,
        int expectedLength
    )
    {
        return ruleBuilder.Custom(
            (value, context) =>
            {
                int length = value.ToString().Length;
                if (length != expectedLength)
                {
                    context.AddError(
                        Errors.Generic.IncorrectLength(nameof(EmailVerificationCode), length)
                    );
                }
            }
        );
    }

    public static void MustBeOk<T, TProperty, TValue>(
        this IRuleBuilder<T, TProperty> ruleBuilder,
        Func<TProperty, Result<TValue, Error>> callback
    )
    {
        ruleBuilder.Custom(
            (value, context) =>
            {
                Result<TValue, Error> result = callback(value);
                if (result.IsFailure)
                {
                    context.AddError(result.Error);
                }
            }
        );
    }
}
