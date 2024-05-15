export class ResultOf<TError> {
    isSuccess: boolean;
    isFailure: boolean;
    error: TError | null;

    private constructor(isSuccess: boolean, errorMessage: TError | null) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = errorMessage;
    }

    public static Ok<TError>(): ResultOf<TError> {
        return new ResultOf<TError>(true, null);
    }

    public static Fail<TError>(errorMessage: TError): ResultOf<TError> {
        return new ResultOf<TError>(false, errorMessage);
    }
}
