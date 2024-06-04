import { useEffect, useState } from "react";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";

export default function useInvalidServerError() {
    const [serverError, setServerError] = useState<any | null>(null);

    useEffect(() => {
        if (serverError) {
            throwRouteErrorOnInvalidResponse(serverError);
        }
    }, [serverError]);

    return { setServerError };
}
