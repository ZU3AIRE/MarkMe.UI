import { Skeleton } from "@/components/ui/skeleton";

export default function UpdateAttendanceLoading() {
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-lg p-8 shadow-md w-full">
                    {/* Heading */}
                    <Skeleton className="h-8 w-60 mx-auto mb-8" />
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Left side: Fields and button */}
                        <div className="flex-1 min-w-[260px] flex flex-col gap-12">
                            {/* Dropdown 1 */}
                            <Skeleton className="h-10 w-full rounded-md" />
                            {/* Dropdown 2 */}
                            <Skeleton className="h-10 w-full rounded-md" />
                            {/* Dropdown 3 */}
                            <Skeleton className="h-10 w-full rounded-md" />
                            {/* Dropdown 4 */}
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        {/* Right side: Calendar and button */}
                        <div className="flex flex-col items-center w-full min-w-[320px]">
                            {/* Calendar */}
                            <Skeleton className="h-[340px] w-full rounded-md mb-4" />
                            {/* Button to the right of calendar */}
                            <div className="flex justify-end w-full">
                                <Skeleton className="h-10 w-32 rounded-md" />
                                <Skeleton className="h-10 w-32 rounded-md ml-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}