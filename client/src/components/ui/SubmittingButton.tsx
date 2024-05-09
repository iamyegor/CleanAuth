import classNames from "classnames";
import { SpinnerCircularFixed } from "spinners-react";
import BaseProps from "@/pages/Signup/types/BaseProps.ts";

interface SubmittingButton extends BaseProps {
    loading: boolean;
    text: string;
    disabled?: boolean;
}

export default function SubmittingButton({
    loading,
    text,
    additionalClasses,
    disabled = false,
}: SubmittingButton) {
    const defaultClasses =
        "w-full p-4 h-14 text-white rounded-md transition mb-8 flex justify-center items-center";

    const enabledClasses = classNames("active:scale-105", additionalClasses);

    const disabledClasses = "bg-neutral-500";

    const classes: string = classNames(
        defaultClasses,
        loading || disabled ? disabledClasses : enabledClasses,
    );

    return (
        <button disabled={loading || disabled} type="submit" className={classes}>
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
