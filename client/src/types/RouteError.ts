export class RouteError extends Error {
    code: string;

    private constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }

    static unexpected(): RouteError {
        return new RouteError("unexpected", "Unexpected error. Please try again later.");
    }
    
    static serverError(): RouteError {
        return new RouteError("server.error", "Error on our side. Please try again later.");
    }
}
