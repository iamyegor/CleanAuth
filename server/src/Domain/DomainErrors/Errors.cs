using Domain.User.ValueObjects;
using XResults;

namespace Domain.DomainErrors;

public static class Errors
{
    public static class Generic
    {
        public static Error IsRequired(string property, object value)
        {
            var details = new Dictionary<string, object?>() { [property] = value };
            return new Error("is.required", $"{property} is required", details);
        }

        public static Error TooLong(string property, int length)
        {
            var details = new Dictionary<string, object?>() { [$"{property}Length"] = length };
            return new Error("too.long", $"{property} is too long", details);
        }

        public static Error TooShort(string property, int length)
        {
            var details = new Dictionary<string, object?>() { [$"{property}Length"] = length };
            return new Error("too.short", $"{property} is too short", details);
        }

        public static Error IncorrectLength(string property, int length)
        {
            var details = new Dictionary<string, object?>() { [$"{property}Length"] = length };
            return new Error("incorrect.length", $"{property} has incorrect length", details);
        }
    }

    public class Login
    {
        public static Error InvalidSymbols(string value)
        {
            var details = new Dictionary<string, object?>() { ["login"] = value };
            return new Error(
                "login.invalid.symbols",
                "Login can contain only numbers letters and underscores",
                details
            );
        }

        public static Error TheSameLoginExists(string value)
        {
            var details = new Dictionary<string, object?>() { ["login"] = value };
            return new Error(
                "same.login.exists",
                "User with the same login already exists",
                details
            );
        }

        public static Error TheSameEmailExists(string value)
        {
            var details = new Dictionary<string, object?>() { ["email"] = value };
            return new Error(
                "same.email.exists",
                "User with the same email already exists",
                details
            );
        }
    }

    public class Password
    {
        public static Error InvalidLength(string value)
        {
            var details = new Dictionary<string, object?>() { ["password"] = value };
            return new Error(
                "password.invalid.length",
                "Password must be from 6 to 50 characters",
                details
            );
        }

        public static Error InvalidSignature(string value)
        {
            var details = new Dictionary<string, object?>() { ["password"] = value };
            return new Error(
                "password.invalid.signature",
                "Password must contain at least one upper case, one lower case letter and either one number or a special character",
                details
            );
        }
    }

    public class User
    {
        public static Error IncorrectLoginOrPassword(string login, string password)
        {
            var details = new Dictionary<string, object?>()
            {
                ["login"] = login,
                ["password"] = password
            };

            return new Error("incorrect.login.or.password", "Incorrect login or password", details);
        }

        public static Error NotFound(UserId userId)
        {
            var details = new Dictionary<string, object?>() { ["userId"] = userId.Value };
            return new Error("user.not.found", "User was not found", details);
        }

        public static Error NotFound(string emailOrLogin)
        {
            var details = new Dictionary<string, object?>() { ["emailOrLogin"] = emailOrLogin };
            return new Error("user.not.found", "User was not found", details);
        }

        public static Error NotFoundWithRefreshToken(string refreshToken)
        {
            var details = new Dictionary<string, object?>() { ["refreshToken"] = refreshToken };
            return new Error(
                "user.not.found.with.refresh.token",
                "User was not found with provided refresh token",
                details
            );
        }

        public static Error NoPhoneNumber()
        {
            return new Error("no.phone.number", "User has no phone number");
        }
    }

    public class Server
    {
        public static Error InternalServerError(string errorMessage)
        {
            return new Error("internal.server.error", errorMessage);
        }
    }

    public class RefreshToken
    {
        public static Error Invalid(string value)
        {
            var details = new Dictionary<string, object?>() { ["refreshToken"] = value };
            return new Error("refresh.token.invalid", "Refresh token is invalid", details);
        }

        public static Error NotProvided()
        {
            return new Error("refresh.token.is.not.provided", "Refresh token isn't provided");
        }
    }

    public class Email
    {
        public static Error IncorrectSignature(string value)
        {
            var details = new Dictionary<string, object?>() { ["email"] = value };
            return new Error("email.incorrect.signature", "Email has invalid signature", details);
        }
    }

    public class AccessToken
    {
        public static Error InvalidToken()
        {
            return new Error("invalid.access.token", "Invalid JWT access token");
        }

        public static Error NotProvided()
        {
            return new Error("access.token.is.not.provided", "Access token isn't provided");
        }
    }

    public class EmailVerificationCode
    {
        public static Error IsExpired()
        {
            return new Error(
                "email.verification.code.expired",
                "Email verification code is expired"
            );
        }

        public static Error IsIncorrect(object? value)
        {
            var details = new Dictionary<string, object?>() { ["code"] = value };
            return new Error("invalid", $"Code is incorrect", details);
        }
    }

    public class PhoneNumber
    {
        public static Error IncorrectSignature(string value)
        {
            var details = new Dictionary<string, object?>() { ["phoneNumber"] = value };
            return new Error(
                "phone.number.incorrect.signature",
                "Phone number has an incorrect signature",
                details
            );
        }

        public static Error AlreadyTaken(string value)
        {
            var details = new Dictionary<string, object?>() { ["phoneNumber"] = value };
            return new Error(
                "phone.number.already.taken",
                "Phone number is already taken",
                details
            );
        }
    }

    public class PhoneNumberVerificationCode
    {
        public static Error IsIncorrect()
        {
            return new Error(
                "phone.number.verification.code.incorrect",
                "Phone number verification code is incorrect"
            );
        }

        public static Error IsExpired()
        {
            return new Error(
                "phone.number.verification.code.expired",
                "Phone number verification code is expired"
            );
        }
    }

    public class RestorePasswordToken
    {
        public static Error Incorrect(object value)
        {
            var details = new Dictionary<string, object?>() { ["token"] = value };
            return new Error(
                "restore.password.token.incorrect",
                "Restore password token is incorrect",
                details
            );
        }

        public static SuccessOr<Error> WasntRequested()
        {
            return new Error(
                "restore.password.token.wasnt.requested",
                "Restore password token wasn't requested"
            );
        }

        public static SuccessOr<Error> IsExpired()
        {
            return new Error("restore.password.token.expired", "Restore password token is expired");
        }
    }
}
