namespace Domain.DomainErrors;

public static partial class Errors
{
    public class PhoneNumber
    {
        public static Error IsRequired()
        {
            return new Error("phone.number.is.required", "Phone number is required");
        }

        public static Error IsTooLong(string phoneNumber)
        {
            var details = new Dictionary<string, object?>()
            {
                ["phoneNumberLength"] = phoneNumber.Length
            };
            
            return new Error(
                "phone.number.too.long",
                "Phone number can't be longer than 15 numbers",
                details
            );
        }

        public static Error HasInvalidSignature(string value)
        {
            var details = new Dictionary<string, object?>() { ["phoneNumber"] = value };
            return new Error(
                "phone.number.invalid.signature",
                "Phone number has an invalidsignature",
                details
            );
        }

        public static Error IsAlreadyTaken(string value)
        {
            var details = new Dictionary<string, object?>() { ["phoneNumber"] = value };
            return new Error(
                "phone.number.already.taken",
                "Phone number is already taken",
                details
            );
        }
    }
}
