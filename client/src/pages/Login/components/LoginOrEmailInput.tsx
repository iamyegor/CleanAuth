import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import classNames from "classnames";
import useLoginPageInputError from "@/hooks/useLoginPageInputError.ts";
import FieldError from "@/utils/FieldError.ts";

interface LoginOrEmailInputProps {
    loginError: FieldError | null;
}

export default function LoginOrEmailInput({ loginError }: LoginOrEmailInputProps) {
    const { shouldApplyErrorClass, errorMessage } = useLoginPageInputError(
        loginError,
        "loginOrEmail",
    );

    const classes = classNames(
        "login-input__default",
        shouldApplyErrorClass ? "login-input__error" : "login-input__no-error",
    );

    return (
        <div className="space-y-4" data-testid="LoginOrEmailInput">
            <input
                type={"text"}
                name={"loginOrEmail"}
                placeholder={"Login or Email"}
                className={classes}
                data-testid="LoginOrEmailInput.Input"
            />
            <ErrorMessageComponent errorMessage={errorMessage ?? null} />
        </div>
    );
}
