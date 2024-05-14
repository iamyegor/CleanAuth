import ErrorMessage from "@/utils/ErrorMessage.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { RouteError } from "@/types/RouteError.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";

export default function extractAddPhoneNumberError(
    response: AxiosError<ServerErrorResponse>,
): ErrorMessage {
    throwRouteErrorOnInvalidResponse(response);

    const { errorCode } = response.response!.data;
    if (errorCode === "phone.number.already.taken") {
        return ErrorMessage.create("Phone number is already taken.");
    } else {
        throw RouteError.unexpected();
    }
}
