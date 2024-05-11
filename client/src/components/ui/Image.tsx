import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function Image({ src, alt, className, ...rest }: ImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            {...rest}
            className={`select-none ${className} `}
            onDragStart={(e) => e.preventDefault()}
        />
    );
}
