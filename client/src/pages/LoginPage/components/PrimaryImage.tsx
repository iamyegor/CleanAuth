interface PrimaryImageProps {
    src: string;
    alt: string;
}

export default function PrimaryImage(props: PrimaryImageProps) {
    return (
        <div className="w-2/5 flex justify-center items-center">
            <img
                src={props.src}
                alt={props.alt}
                className="w-full h-full max-h-screen p-3 rounded-3xl object-cover"
            />
        </div>
    );
}
