import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            {/* Header */}
            <div className="flex flex-row justify-between gap-4">
                <Skeleton className="h-5 w-48" />
                {/* Top Section: Form and Calendar */}
                <div className="flex flex-row justify-center gap-12">
                    {/* Left side: Form fields */}
                    <div className="flex flex-col gap-4 min-w-[450px]">
                        {/* Course Dropdown */}
                        <Skeleton className="h-0 w-full rounded-md" />
                        {/* Status Dropdown */}
                        <Skeleton className="h-10 w-full rounded-md" />
                        {/* Roll Numbers Input */}
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        {/* Mark Attendance Button */}
                        <Skeleton className="h-10 w-40 rounded-md self-end" />
                    </div>
                    {/* Right side: Calendar */}
                    <div className="flex flex-col items-center min-w-[280px] w-[100px]">
                        <Skeleton className="h-[280px] w-full rounded-md mb-4" />
                    </div>
                </div>
            </div>
            {/* Search and controls */}
            <div className="flex items-center py-4 gap-2">
                {/* Search bar */}
                <Skeleton className="h-[35px] w-[385px] rounded-md" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
                {/* Column button at the end */}
                <div className="ml-auto flex gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </div>
            {/* Table */}
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