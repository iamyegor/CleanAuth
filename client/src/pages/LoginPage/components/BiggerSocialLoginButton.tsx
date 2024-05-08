interface BiggerSocialLoginButtonProps {
    logo: string;
    alt: string;
}

export default function BiggerSocialLoginButton({ logo, alt }: BiggerSocialLoginButtonProps) {
    return (
        <button
            className="p-3 px-6 bg-white border rounded-md shadow-lg  hover:border-gray-400 
        hover:shadow-xl transition select-none group"
        >
            <img
                src={logo}
                alt={alt}
                className="w-8 h-8 group-hover:scale-110 transition-transform 
            duration-300"
            />
        </button>
    );
}
