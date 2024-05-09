interface SocialLoginButtonProps {
    logo: string;
    alt: string;
}

export default function SocialLoginButton(props: SocialLoginButtonProps) {
    return (
        <button
            className="p-2 bg-transparent border border-gray-300 rounded-md
            shadow-sm px-5 hover:border-gray-200 hover:shadow-md transition select-none group"
        >
            <img
                src={props.logo}
                alt={props.alt}
                className="w-8 h-8 group-hover:scale-110 transition-transform 
            duration-300"
            />
        </button>
    );
}
