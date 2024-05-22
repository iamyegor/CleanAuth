import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import checkImage from "@/components/VerifyCodeForm/images/check.png";
import Image from "@/components/ui/Image.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";

interface SuccessOrErrorMessageProps {
    feedback: FeedbackMessage | null;
}

export default function FeedbackMessageComponent({ feedback }: SuccessOrErrorMessageProps) {
    if (!feedback) {
        return;
    }

    return (
        <>
            {feedback!.isSuccess ? (
                <div className="flex space-x-1.5 text-left">
                    <Image
                        src={checkImage}
                        alt="check"
                        className="w-5 h-5 mt-0.5"
                        data-testid="FeedbackMessageComponent.CheckIcon"
                    />
                    <p
                        className="text-green-500"
                        data-testid="FeedbackMessageComponent.SuccessMessage"
                    >
                        {feedback!.message}
                    </p>
                </div>
            ) : (
                <ErrorMessageComponent errorMessage={ErrorMessage.create(feedback!.message)} />
            )}
        </>
    );
}
