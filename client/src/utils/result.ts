export class Result {
    isSuccess: boolean;
    isFailure: boolean;
    errorMessage: string | null;

    private constructor(isSuccess: boolean, errorMessage: string | null) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.errorMessage = errorMessage;
    }

    public static Ok(): Result {
        return new Result(true, null);
    }

    public static Fail(errorMessage: string): Result {
        return new Result(false, errorMessage);
    }
}
