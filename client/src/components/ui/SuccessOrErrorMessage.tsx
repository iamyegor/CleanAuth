import DisplayedMessage from "@/DisplayedMessage.ts";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import checkImage from "@/components/VerifyCodeForm/images/check.png";
import Image from "@/components/ui/Image.tsx";

interface SuccessOrErrorMessageProps {
    message: DisplayedMessage | null;
}
export default function SuccessOrErrorMessage({ message }: SuccessOrErrorMessageProps) {
    return (
        <>
            {message && (
                <div className="flex justify-center">
                    {message.isSuccess ? (
                        <div className="flex space-x-1.5 items-center">
                            <Image src={checkImage} alt="check" className="w-5 h-5" />
                            <p className="text-green-500">{message.message}</p>
                        </div>
                    ) : (
                        <ErrorMessage errorMessage={message.message} />
                    )}
                </div>
            )}
        </>
    );
}
