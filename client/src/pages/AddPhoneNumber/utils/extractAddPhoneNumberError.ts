import ErrorMessage from "@/utils/ErrorMessage.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { RouteError } from "@/types/RouteError.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";

export default function extractAddPhoneNumberError(
    error: AxiosError<ServerErrorResponse>,
): ErrorMessage {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode } = error.response!.data;
    if (errorCode === "phone.number.already.taken") {
        return ErrorMessage.create("Phone number is already taken.");
    } else if (errorCode === "phone.number.is.required") {
        return ErrorMessage.create("Phone number field must not be empty.");
    } else if (errorCode === "phone.number.too.long") {
        return ErrorMessage.create("Phone number can't be longer than 15 characters.");
    } else if (errorCode === "phone.number.invalid.signature") {
        return ErrorMessage.create("Phone number is invalid.");
    } else {
        throw RouteError.unexpected();
    }
}
