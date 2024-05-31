export class ResultOr<TError> {
    isSuccess: boolean;
    isFailure: boolean;
    error: TError | null;

    private constructor(isSuccess: boolean, errorMessage: TError | null) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = errorMessage;
    }

    public static Ok<TError>(): ResultOr<TError> {
        return new ResultOr<TError>(true, null);
    }

    public static Fail<TError>(errorMessage: TError): ResultOr<TError> {
        return new ResultOr<TError>(false, errorMessage);
    }
}
