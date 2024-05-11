import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function Image({ src, alt, ...rest }: ImageProps) {
    return <img src={src} alt={alt} {...rest} onDragStart={(e) => e.preventDefault()} />;
}
