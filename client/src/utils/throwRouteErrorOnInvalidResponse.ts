import { RouteError } from "@/types/RouteError.ts";

export default function throwRouteErrorOnInvalidResponse(error: any): void {
    if (!error.response?.data) {
        throw RouteError.unexpected();
    } else if (error.response.status === 500) {
        throw RouteError.serverError();
    }
}
