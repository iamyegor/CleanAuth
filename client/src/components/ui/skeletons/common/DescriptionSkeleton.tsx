import { ComponentProps } from "react";
import BaseSkeleton from "@/components/ui/skeletons/common/BaseSkeleton.tsx";

export default function DescriptionSkeleton({
    style,
    ...props
}: ComponentProps<typeof BaseSkeleton>) {
    return <BaseSkeleton style={{ height: "25px", ...style }} {...props} />;
}
