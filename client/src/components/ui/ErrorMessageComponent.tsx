import exclamationMark from "@/assets/exclamation.png";
import Image from "@/components/ui/Image.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { useEffect } from "react";

interface ErrorMessageComponentProps {
    errorMessage: ErrorMessage | null;
    setIsErrorShown?: (isErrorShown: boolean) => void;
}

export default function ErrorMessageComponent({
    errorMessage,
    setIsErrorShown,
}: ErrorMessageComponentProps) {
    useEffect(() => {
        if (setIsErrorShown) {
            setIsErrorShown(shouldShowErrorMessage());
        }
    }, [shouldShowErrorMessage()]);

    function shouldShowErrorMessage(): boolean {
        return !!errorMessage?.errorMessage;
    }

    return shouldShowErrorMessage() ? (
        <>
            <div className="flex items-start space-x-2">
                <Image src={exclamationMark} alt="exclamationMark" className="w-5 h-5 mt-0.5" />
                <div className="text-red-500 text-left">{errorMessage!.errorMessage}</div>
            </div>
        </>
    ) : null;
}
