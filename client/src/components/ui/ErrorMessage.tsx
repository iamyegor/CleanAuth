import exclamationMark from "@/assets/exclamation.png";
import classNames from "classnames";
import Image from "@/components/ui/Image.tsx";

interface ErrorMessageProps {
    errorMessage: string;
    extraTopMargin?: boolean;
}

export default function ErrorMessage({ errorMessage, extraTopMargin }: ErrorMessageProps) {
    return (
        <div className={classNames("flex items-start space-x-2", extraTopMargin ? "mt-8" : "mt-4")}>
            <Image src={exclamationMark} alt="exclamationMark" className="w-5 h-5 mt-0.5" />
            <div className="text-red-500 text-left">{errorMessage}</div>
        </div>
    );
}
