import React from "react";
import BaseSkeleton from "@/components/ui/skeletons/common/BaseSkeleton.tsx";
import SquareSkeleton from "@/components/ui/skeletons/common/SquareSkeleton.tsx";
import HeadingSkeleton from "@/components/ui/skeletons/common/HeadingSkeleton.tsx";
import DescriptionSkeleton from "@/components/ui/skeletons/common/DescriptionSkeleton.tsx";

export default function SignupPageSkeleton() {
    return (
        <>
            <HeadingSkeleton style={{ width: "250px", marginBottom: "14px" }} />
            <DescriptionSkeleton style={{ maxWidth: "180px", marginBottom: "40px" }} />
            <SquareSkeleton style={{ marginBottom: "16px" }} />
            <SquareSkeleton style={{ marginBottom: "16px" }} />
            <SquareSkeleton style={{ marginBottom: "16px" }} />
            <SquareSkeleton style={{ marginBottom: "32px" }} />
            <div className="flex mb-8">
                <BaseSkeleton style={{ height: "16px", width: "180px", marginRight: "10px" }} />
            </div>
            <SquareSkeleton />
        </>
    );
}
