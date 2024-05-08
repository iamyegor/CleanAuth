export class Result<TError> {
    isSuccess: boolean;
    isFailure: boolean;
    error: TError | null;

    private constructor(isSuccess: boolean, errorMessage: TError | null) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = errorMessage;
    }

    public static Ok<TError>(): Result<TError> {
        return new Result<TError>(true, null);
    }

    public static Fail<TError>(errorMessage: TError): Result<TError> {
        return new Result<TError>(false, errorMessage);
    }
}
