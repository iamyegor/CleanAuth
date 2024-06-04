import BaseSkeleton from "@/components/ui/skeletons/common/BaseSkeleton.tsx";
import SquareSkeleton from "@/components/ui/skeletons/common/SquareSkeleton.tsx";
import HeadingSkeleton from "@/components/ui/skeletons/common/HeadingSkeleton.tsx";
import DescriptionSkeleton from "@/components/ui/skeletons/common/DescriptionSkeleton.tsx";

interface VerifyCodeFormSkeletonProps {
    inputsNumber: number;
}

export default function VerifyCodePageSkeleton({ inputsNumber }: VerifyCodeFormSkeletonProps) {
    function inputsSkeleton() {
        const inputs = [];

        for (let i = 0; i < inputsNumber; i++) {
            inputs.push(
                <div className="w-12 h-12 sm:w-14 sm:h-14" key={i}>
                    <SquareSkeleton style={{ height: "100%", width: "100%" }} />
                </div>,
            );
        }

        return inputs;
    }

    return (
        <>
            <HeadingSkeleton style={{ maxWidth: "320px", marginBottom: "14px" }} />
            <DescriptionSkeleton style={{ maxWidth: "100%" }} />
            <DescriptionSkeleton style={{ maxWidth: "200px", marginBottom: "36px" }} />
            <div className="flex justify-center space-x-3 mb-8">{inputsSkeleton()}</div>
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <div className="flex space-x-2 mb-8">
                <div className="flex-1">
                    <SquareSkeleton style={{ width: "100%" }} />
                </div>
                <div className="flex-1">
                    <SquareSkeleton style={{ width: "100%" }} />
                </div>
            </div>
            <BaseSkeleton style={{ maxWidth: "280px", height: "20px" }} />
        </>
    );
}
