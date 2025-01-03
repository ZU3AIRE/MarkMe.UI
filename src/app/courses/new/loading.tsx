import { Skeleton } from "@/components/ui";
import { Minus } from "lucide-react";

export default function Loading() {
    return (
        <>
            <div className="flex items-center justify-between py-4">
                <div>
                    <Skeleton className="h-[35px] w-[220px] rounded-md" />
                </div>
                <Skeleton className="h-[35px] w-[100px] rounded-md" />
            </div>
            <div className="grid grid-cols-3 gap-8 mt-4">
                <div className="col-span-3">
                    <Skeleton className="h-[15px] w-[60px] rounded-md mb-2" />
                    <div className="flex gap-1">
                        <Skeleton className="h-[35px] w-[35px] rounded-md" />
                        <Skeleton className="h-[35px] w-[35px] rounded-md" />
                        <Minus />
                        <Skeleton className="h-[35px] w-[35px] rounded-md" />
                        <Skeleton className="h-[35px] w-[35px] rounded-md" />
                        <Skeleton className="h-[35px] w-[35px] rounded-md" />
                    </div>
                </div>
                <div>
                    <Skeleton className="h-[15px] w-[180px] rounded-md mb-2" />
                    <Skeleton className="h-[35px] w-full rounded-md" />
                </div>

                <div>
                    <Skeleton className="h-[15px] w-[180px] rounded-md mb-2" />
                    <Skeleton className="h-[35px] w-full rounded-md" />
                </div>

                <div>
                    <Skeleton className="h-[15px] w-[180px] rounded-md mb-2" />
                    <Skeleton className="h-[35px] w-full rounded-md" />
                </div>

                <div>
                    <Skeleton className="h-[15px] w-[180px] rounded-md mb-2" />
                    <Skeleton className="h-[35px] w-full rounded-md" />
                </div>

                <div>
                    <Skeleton className="h-[15px] w-[180px] rounded-md mb-2" />
                    <Skeleton className="h-[35px] w-full rounded-md" />
                </div>

                <div className="col-span-3 flex justify-end">
                    <Skeleton className="h-[35px] w-[100px] rounded-md" />
                    <Skeleton className="ms-2 h-[35px] w-[100px] rounded-md" />
                </div>
            </div>
        </>
    );
}