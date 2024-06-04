import SquareSkeleton from "@/components/ui/skeletons/common/SquareSkeleton.tsx";
import HeadingSkeleton from "@/components/ui/skeletons/common/HeadingSkeleton.tsx";
import DescriptionSkeleton from "@/components/ui/skeletons/common/DescriptionSkeleton.tsx";

export default function AddPhoneNumberPageSkeleton() {
    return (
        <>
            <HeadingSkeleton style={{ width: "90%" }} />
            <HeadingSkeleton style={{ width: "180px", marginBottom: "14px" }} />
            <DescriptionSkeleton style={{ maxWidth: "100%" }} />
            <DescriptionSkeleton style={{ maxWidth: "150px", marginBottom: "36px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <SquareSkeleton />
        </>
    );
}
