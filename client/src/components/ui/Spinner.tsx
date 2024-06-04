import { SpinnerCircularFixed } from "spinners-react";
import { ComponentProps } from "react";

interface SpinnerProps extends Partial<ComponentProps<typeof SpinnerCircularFixed>> {
    size: number;
}

export default function Spinner({ size, ...props }: SpinnerProps) {
    return (
        <div data-testid="Spinner">
            <SpinnerCircularFixed
                size={size}
                thickness={200}
                speed={100}
                color="rgba(194, 194, 194, 1)"
                secondaryColor="rgba(173, 173, 173, 0.3)"
                {...props}
            />
        </div>
    );
}
