import BaseSkeleton from "@/components/ui/skeletons/common/BaseSkeleton.tsx";
import { ComponentProps } from "react";

export default function HeadingSkeleton({ style, ...props }: ComponentProps<typeof BaseSkeleton>) {
    return <BaseSkeleton style={{ height: "40px", ...style }} {...props} />;
}
