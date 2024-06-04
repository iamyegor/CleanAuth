import HeadingSkeleton from "@/components/ui/skeletons/common/HeadingSkeleton.tsx";
import DescriptionSkeleton from "@/components/ui/skeletons/common/DescriptionSkeleton.tsx";
import SquareSkeleton from "@/components/ui/skeletons/common/SquareSkeleton.tsx";

export default function PasswordResetPageSkeleton() {
    return (
        <>
            <HeadingSkeleton style={{ width: "250px", marginBottom: "4px" }} />
            <HeadingSkeleton style={{ width: "210px", marginBottom: "32px" }} />
            <DescriptionSkeleton style={{ maxWidth: "100%", marginBottom: "32px" }} />
            <SquareSkeleton style={{ marginBottom: "16px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
        </>
    );
}
