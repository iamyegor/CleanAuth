namespace Domain.DomainErrors;

public static partial class Errors
{
    public class PhoneNumberVerificationCode
    {
        public static Error IsInvalid()
        {
            return new Error(
                "phone.number.verification.code.invalid",
                "Phone number verification code is invalid"
            );
        }

        public static Error IsExpired()
        {
            return new Error(
                "phone.number.verification.code.expired",
                "Phone number verification code is expired"
            );
        }

        public static Error HasInvalidLength(int code)
        {
            var details = new Dictionary<string, object?>() { ["code"] = code };
            return new Error(
                "phone.number.verification.code.invalid.length",
                "Phone number verification code must be 4 characters long",
                details
            );
        }
    }
}
