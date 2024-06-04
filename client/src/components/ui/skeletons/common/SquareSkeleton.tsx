import BaseSkeleton from "@/components/ui/skeletons/common/BaseSkeleton.tsx";
import { ComponentProps } from "react";

export default function SquareSkeleton({ style, ...props }: ComponentProps<typeof BaseSkeleton>) {
    return <BaseSkeleton style={{ height: "56px", ...style }} {...props} />;
}
