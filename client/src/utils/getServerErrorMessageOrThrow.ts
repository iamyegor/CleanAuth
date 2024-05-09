import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";

export default function getServerErrorMessageOrThrow(err: any): string {
    const error = err as AxiosError<ServerErrorResponse>;
    if (error.response?.data) {
        return error.response.data.errorMessage;
    }

    throw new Error("No response was received");
}
