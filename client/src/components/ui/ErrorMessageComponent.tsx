import exclamationMark from "@/assets/exclamation.png";
import Image from "@/components/ui/Image.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { useEffect } from "react";

interface ErrorMessageComponentProps {
    errorMessage: ErrorMessage | null | undefined;
    handleErrorShown?: (isErrorShown: boolean) => void;
}

export default function ErrorMessageComponent({
    errorMessage,
    handleErrorShown,
}: ErrorMessageComponentProps) {
    useEffect(() => {
        if (handleErrorShown) {
            handleErrorShown(shouldShowErrorMessage());
        }
    }, [shouldShowErrorMessage()]);

    function shouldShowErrorMessage(): boolean {
        return !!errorMessage?.value;
    }

    return shouldShowErrorMessage() ? (
        <>
            <div className="flex items-start space-x-2" data-testid="ErrorMessageComponent">
                <Image src={exclamationMark} alt="exclamationMark" className="w-5 h-5 mt-0.5" />
                <p data-testid="ErrorMessageComponent.Message" className="text-red-500 text-left">
                    {errorMessage!.value}
                </p>
            </div>
        </>
    ) : null;
}
