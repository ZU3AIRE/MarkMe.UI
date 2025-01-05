import { Skeleton } from "@/components/ui";
import { Minus } from "lucide-react";

export default function Loading() {
    return (
        <>
            <div className="flex flex-col gap-8 lg:p-12">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-[30px] w-[220px] rounded-md" />
                        <Skeleton className="h-[15px] w-[150px] rounded-md mt-2" />
                    </div>
                    <Skeleton className="h-[35px] w-[100px] rounded-md" />
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
                    {/* College Roll No */}
                    <div>
                        <Skeleton className="h-[15px] w-[140px] rounded-md mb-2" />
                        <div className="flex gap-2">
                            <Skeleton className="h-[35px] w-[35px] rounded-md" />
                            <Skeleton className="h-[35px] w-[35px] rounded-md" />
                            <Skeleton className="h-[35px] w-[35px] rounded-md" />
                            <Skeleton className="h-[35px] w-[35px] rounded-md" />
                        </div>
                    </div>

                    {/* University Roll No */}
                    <div>
                        <Skeleton className="h-[15px] w-[160px] rounded-md mb-2" />
                        <div className="flex gap-2">
                            {[...Array(10)].map((_, index) => (
                                <Skeleton key={index} className="h-[35px] w-[35px] rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Registration No */}
                    <div>
                        <Skeleton className="h-[15px] w-[160px] rounded-md mb-2" />
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, index) => (
                                <Skeleton key={index} className="h-[35px] w-[35px] rounded-md" />
                            ))}
                            <Minus />
                            {[...Array(3)].map((_, index) => (
                                <Skeleton key={index} className="h-[35px] w-[35px] rounded-md" />
                            ))}
                            <Minus />
                            {[...Array(3)].map((_, index) => (
                                <Skeleton key={index} className="h-[35px] w-[35px] rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* First Name */}
                    <div>
                        <Skeleton className="h-[15px] w-[120px] rounded-md mb-2" />
                        <Skeleton className="h-[35px] w-full rounded-md" />
                    </div>

                    {/* Last Name */}
                    <div>
                        <Skeleton className="h-[15px] w-[120px] rounded-md mb-2" />
                        <Skeleton className="h-[35px] w-full rounded-md" />
                    </div>

                    {/* Session */}
                    <div>
                        <Skeleton className="h-[15px] w-[120px] rounded-md mb-2" />
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, index) => (
                                <Skeleton key={index} className="h-[35px] w-[35px] rounded-md" />
                            ))}
                            <Minus />
                            {[...Array(4)].map((_, index) => (
                                <Skeleton key={index} className="h-[35px] w-[35px] rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Section */}
                    <div>
                        <Skeleton className="h-[15px] w-[120px] rounded-md mb-2" />
                        <Skeleton className="h-[35px] w-full rounded-md" />
                    </div>

                    {/* Action Buttons */}
                    <div className="col-span-1 sm:col-span-3 flex justify-end gap-4">
                        <Skeleton className="h-[35px] w-[128px] rounded-md" />
                        <Skeleton className="h-[35px] w-[128px] rounded-md" />
                    </div>
                </div>
            </div>
        </>
    );
}