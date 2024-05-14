import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { RouteError } from "@/types/RouteError.ts";

export default function extractRequestPasswordResetError(
    error: AxiosError<ServerErrorResponse>,
): FeedbackMessage {
    throwRouteErrorOnInvalidResponse(error);

    const { errorCode } = error.response!.data;
    if (errorCode === "user.not.exists.with.login.or.email") {
        return FeedbackMessage.createError("User with this login or email does not exist.");
    } else {
        throw RouteError.unexpected();
    }
}
