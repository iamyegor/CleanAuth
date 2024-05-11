interface SeparatorLineProps {
    text: string;
}

export default function SeparatorLine({ text }: SeparatorLineProps) {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-neutral-300"></div>
            <span className="mx-4 text-sm text-gray-600">{text}</span>
            <div className="flex-grow border-t border-neutral-300"></div>
        </div>
    );
}
