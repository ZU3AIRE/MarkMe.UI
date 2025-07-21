import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pe-4 ps-8">
            {/* Header */}
            <div className="flex flex-row justify-between w-full gap-4 mb-6">
                <Skeleton className="h-8 w-48" />
                <div className="flex flex-row gap-4">
                    {/* Two dropdowns */}
                    <Skeleton className="h-10 w-48 rounded-md" />
                    <Skeleton className="h-10 w-48 rounded-md" />
                    {/* Textbox */}
                    <Skeleton className="h-10 w-56 rounded-md" />
                    {/* Calendar */}
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-56 w-full" />
                    {/* Date range button */}
                    <Skeleton className="h-10 w-40 rounded-md" />
                </div>
            </div>
            {/* Search and controls */}
            <div className="flex items-center py-4 gap-2">
                {/* Search bar */}
                <Skeleton className="h-9 w-64 rounded-md" />
                {/* Column button at the end */}
                <div className="ml-auto flex gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </div>
            {/* Table */}
            <div className="rounded-md border p-4 mt-2">
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
            </div>
        </div>
    );
}