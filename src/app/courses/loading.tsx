import { Skeleton } from "@/components/ui";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <div className="flex items-center justify-between py-4">
                <Skeleton className="h-[35px] w-[220px] rounded-md" />
                <Skeleton className="h-[35px] w-[100px] rounded-md" />
            </div>
            <div className="flex items-center py-4">
                <Skeleton className="h-[35px] w-[385px] rounded-md" />
                <Skeleton className="h-[35px] w-[120px] rounded-md ml-auto" />
            </div>
            <div>
                <Skeleton className="h-[135px] w-full rounded-md ml-auto" />
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1">
                    <Skeleton className="h-[30px] w-[125px] rounded-md" />
                </div>
                <div className="space-x-2 flex">
                    <Skeleton className="h-[30px] w-[75px] rounded-md" />
                    <Skeleton className="h-[30px] w-[75px] rounded-md" />
                </div>
            </div>
        </>
    );
}