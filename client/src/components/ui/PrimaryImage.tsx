import Image from "@/components/ui/Image.tsx";

interface PrimaryImageProps {
    src: string;
    alt: string;
}

export default function PrimaryImage({ src, alt }: PrimaryImageProps) {
    return (
        <div className="w-2/5 justify-center items-center hidden xl:flex">
            <Image
                src={src}
                alt={alt}
                className="w-full h-full max-h-screen p-3 rounded-3xl object-cover"
                data-testid="PrimaryImage.Image"
            />
        </div>
    );
}
