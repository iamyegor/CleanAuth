import classNames from "classnames";
import BaseProps from "@/pages/Signup/types/BaseProps.ts";

interface SeparatorLineProps extends BaseProps {
    text: string;
}

export default function SeparatorLine({ text, additionalClasses }: SeparatorLineProps) {
    return (
        <div className={classNames("flex items-center justify-center", additionalClasses)}>
            <div className="flex-grow border-t border-neutral-300"></div>
            <span className="mx-4 text-sm text-gray-600">{text}</span>
            <div className="flex-grow border-t border-neutral-300"></div>
        </div>
    );
}
