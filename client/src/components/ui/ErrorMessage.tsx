import exclamationMark from "@/assets/exclamation.png";
import BaseProps from "@/pages/Signup/types/BaseProps.ts";
import classNames from "classnames";
interface ErrorMessageProps extends BaseProps {
    errorMessage: string;
}

export default function ErrorMessage({ errorMessage, additionalClasses }: ErrorMessageProps) {
    return (
        <div className={classNames("flex items-start space-x-2", additionalClasses)}>
            <img src={exclamationMark} alt="exclamationMark" className="w-5 h-5 mt-0.5" />
            <div className="text-red-500 text-left">{errorMessage}</div>
        </div>
    );
}
