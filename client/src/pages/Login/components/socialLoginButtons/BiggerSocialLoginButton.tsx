import Image from "@/components/ui/Image.tsx";

interface BiggerSocialLoginButtonProps {
    logo: string;
    alt: string;
    onClick: () => void;
}

export default function BiggerSocialLoginButton({
    logo,
    alt,
    onClick,
}: BiggerSocialLoginButtonProps) {
    return (
        <button
            className="p-3 px-6 bg-white border rounded-md shadow-lg  hover:border-gray-400 
        hover:shadow-xl transition select-none group"
            onClick={onClick}
        >
            <Image
                src={logo}
                alt={alt}
                className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
            />
        </button>
    );
}
