import Skeleton from "react-loading-skeleton";
import { ComponentProps } from "react";

export default function BaseSkeleton(props: ComponentProps<typeof Skeleton>) {
    return (
        <Skeleton
            baseColor="#e0e0e0"
            highlightColor="#d6d6d6"
            {...props}
        />
    );
}
