import classNames from "classnames";
import { SpinnerCircularFixed } from "spinners-react";
import "@/components/SubmittingButton/submitting-button.css";

interface SubmittingButton {
    loading: boolean;
    text: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default function SubmittingButton({
    loading,
    text,
    disabled = false,
    onClick,
}: SubmittingButton) {
    const classes: string = classNames(
        "submitting-button__default",
        loading || disabled ? "submitting-button__disabled" : "submitting-button__enabled",
    );

    return (
        <button
            disabled={loading || disabled}
            type="submit"
            className={`${classes} mb-8`}
            onClick={onClick}
        >
            {loading ? (
                <SpinnerCircularFixed
                    size={30}
                    thickness={200}
                    speed={100}
                    color="rgba(194, 194, 194, 1)"
                    secondaryColor="rgba(173, 173, 173, 0.3)"
                />
            ) : (
                <span>{text}</span>
            )}
        </button>
    );
}
