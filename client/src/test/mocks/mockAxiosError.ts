import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";

const mockAxiosError = (
    status: number,
    data: ServerErrorResponse,
): AxiosError<ServerErrorResponse> => {
    return {
        isAxiosError: true,
        response: {
            status,
            data,
            statusText: "",
            headers: {},
            config: {},
        },
        config: {},
        name: "",
        message: "",
    } as AxiosError<ServerErrorResponse>;
};

export default mockAxiosError;
