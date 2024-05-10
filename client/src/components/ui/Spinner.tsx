import {SpinnerCircularFixed} from "spinners-react";

interface SpinnerProps {
    size: number;
}

export default function Spinner({ size }: SpinnerProps) {
    return (
        <SpinnerCircularFixed
            size={size}
            thickness={200}
            speed={100}
            color="rgba(194, 194, 194, 1)"
            secondaryColor="rgba(173, 173, 173, 0.3)"
        />
    );
}
