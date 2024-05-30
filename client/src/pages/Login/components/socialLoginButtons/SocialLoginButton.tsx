import Image from "@/components/ui/Image.tsx";

interface SocialLoginButtonProps {
    logo: string;
    alt: string;
    onClick?: () => void;
    id?: string;
}

export default function SocialLoginButton({ logo, alt, onClick, id }: SocialLoginButtonProps) {
    return (
        <button
            className="p-2 bg-transparent border border-gray-300 rounded-md
            shadow-sm px-5 hover:border-gray-200 hover:shadow-md transition select-none group"
            type="button"
            id={id}
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
