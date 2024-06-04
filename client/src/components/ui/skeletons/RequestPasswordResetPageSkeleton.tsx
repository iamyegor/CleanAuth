import HeadingSkeleton from "@/components/ui/skeletons/common/HeadingSkeleton.tsx";
import DescriptionSkeleton from "@/components/ui/skeletons/common/DescriptionSkeleton.tsx";
import SquareSkeleton from "@/components/ui/skeletons/common/SquareSkeleton.tsx";

export default function RequestPasswordResetPageSkeleton() {
    return (
        <>
            <HeadingSkeleton style={{ width: "100%", marginBottom: "16px" }} />
            <DescriptionSkeleton style={{ maxWidth: "100%" }} />
            <DescriptionSkeleton style={{ maxWidth: "90%", marginBottom: "32px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <DescriptionSkeleton style={{ maxWidth: "180px" }} />
        </>
    );
}
