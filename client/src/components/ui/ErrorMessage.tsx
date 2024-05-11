import exclamationMark from "@/assets/exclamation.png";
import Image from "@/components/ui/Image.tsx";

interface ErrorMessageProps {
    errorMessage: string;
}

export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
    return (
        <div className="flex items-start space-x-2">
            <Image src={exclamationMark} alt="exclamationMark" className="w-5 h-5 mt-0.5" />
            <div className="text-red-500 text-left">{errorMessage}</div>
        </div>
    );
}
