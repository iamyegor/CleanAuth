import BaseSkeleton from "@/components/ui/skeletons/common/BaseSkeleton.tsx";
import SquareSkeleton from "@/components/ui/skeletons/common/SquareSkeleton.tsx";
import HeadingSkeleton from "@/components/ui/skeletons/common/HeadingSkeleton.tsx";
import DescriptionSkeleton from "@/components/ui/skeletons/common/DescriptionSkeleton.tsx";

export default function LoginPageSkeleton() {
    return (
        <>
            <HeadingSkeleton style={{ width: "230px", marginBottom: "14px" }} />
            <DescriptionSkeleton style={{ maxWidth: "300px", marginBottom: "40px" }} />
            <SquareSkeleton style={{ marginBottom: "16px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <div className="flex justify-between items-center mb-8">
                <BaseSkeleton style={{ height: "16px", width: "120px", marginRight: "10px" }} />
                <BaseSkeleton style={{ height: "16px", width: "120px" }} />
            </div>
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <BaseSkeleton style={{ height: "10px", width: "100%", marginBottom: "32px" }} />
            <div className="flex justify-center items-center space-x-2">
                <BaseSkeleton style={{ height: "50px", width: "73px" }} />
                <BaseSkeleton style={{ height: "57px", width: "81px" }} />
                <BaseSkeleton style={{ height: "50px", width: "73px" }} />
            </div>
        </>
    );
}
