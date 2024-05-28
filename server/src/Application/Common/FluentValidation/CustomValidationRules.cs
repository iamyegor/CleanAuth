using Domain.DomainErrors;
using FluentValidation;
using XResults;

namespace Application.Common.FluentValidation;

public static class CustomValidationRules
{
    public static IRuleBuilderOptionsConditions<T, string> MustNotBeEmpty<T>(
        this IRuleBuilder<T, string?> ruleBuilder,
        Error error
    )
    {
        return ruleBuilder.Custom(
            (value, context) =>
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    context.AddError(error);
                }
            }
        )!;
    }

    public static IRuleBuilderOptionsConditions<T, string> MustBeValidDeviceId<T>(
        this IRuleBuilder<T, string?> ruleBuilder
    )
    {
        return ruleBuilder.Custom(
            (value, context) =>
            {
                if (string.IsNullOrWhiteSpace(value) || !Guid.TryParse(value, out _))
                {
                    context.AddError(Errors.DeviceId.IsInvalid(value));
                }
            }
        )!;
    }

    public static IRuleBuilderOptionsConditions<T, string> MustBeGuid<T>(
        this IRuleBuilder<T, string> ruleBuilder,
        Func<string, Error> callback
    )
    {
        return ruleBuilder.Custom(
            (value, context) =>
            {
                if (!Guid.TryParse(value, out Guid _))
                {
                    Error error = callback(value);
                    context.AddError(error);
                }
            }
        );
    }

    public static IRuleBuilderOptionsConditions<T, int> MustHaveLength<T>(
        this IRuleBuilder<T, int> ruleBuilder,
        int expectedLength,
        Func<int, Error> callback
    )
    {
        return ruleBuilder.Custom(
            (value, context) =>
            {
                int length = value.ToString().Length;
                if (length != expectedLength)
                {
                    Error error = callback(value);
                    context.AddError(error);
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
