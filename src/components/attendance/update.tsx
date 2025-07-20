"use client";
import { ATTENDANCE_STATUS, CourseDropdownModel, IAttendance } from '@/app/models/attendance';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { isAfter } from "date-fns";
import { AttendnaceStatusModel } from '../../app/models/attendance';

const formSchema = z.object({
    courseId: z.string().min(1, { message: "Course is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    dateMarked: z.date({ required_error: "Date is required" }).refine(
        (date) => !isAfter(date, new Date()),
        { message: "Date cannot be in the future" }
    ),
});

type AttendanceUpdateModel = z.infer<typeof formSchema>;

export default function AttendanceUpdateForm({
    defaultValue,
    courses,
    token,
}: {
    defaultValue?: IAttendance;
    courses: CourseDropdownModel[];
    token: string;
}) {
    const router = useRouter();
    const [courseOptions] = useState<CourseDropdownModel[]>(courses);
    const [statusOptions] = useState<AttendnaceStatusModel[]>(ATTENDANCE_STATUS);

    // Parse initial date from backend (string) to Date object
    const initialDate =
        defaultValue?.dateMarked
            ? new Date(defaultValue.dateMarked)
            : new Date();

    const form = useForm<AttendanceUpdateModel>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValue
            ? {
                courseId: defaultValue.courseId?.toString() ?? "",
                status: defaultValue.status ?? "",
                dateMarked: initialDate,
            }
            : {
                courseId: "",
                status: "",
                dateMarked: new Date(),
            },
    });

    const onSubmit = (formData: AttendanceUpdateModel) => {
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}Attendance/UpdateAttendance/${defaultValue?.attendanceId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    AttendanceId: defaultValue?.attendanceId,
                    CourseId: parseInt(formData.courseId),
                    Status: formData.status,
                    DateMarked: formData.dateMarked,
                }),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    switch (response.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        default:
                            toast.error("An error occurred while updating the attendance.");
                            break;
                    }
                }
                return response.ok ? response.json() : null;
            })
            .then((data: IAttendance | null) => {
                if (!data) return;
                toast.success(`Attendance updated successfully!`);
                router.push("/attendance");
            })
            .catch((error: Error) => {
                toast.error("An error occurred while updating the attendance.");
                console.log("🐛 ", error);
            });
    };

    return (
        <>
            <div className="flex items-center justify-between align-start py-4">
                <div>
                    <h1 className="text-2xl font-semibold">Update Attendance</h1>
                </div>
                <Link href="/attendance">
                    <Button variant="outline">
                        <ArrowLeftIcon /> Back
                    </Button>
                </Link>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
                        {/* College Roll No (Read-only, styled like dropdown) */}
                        <FormItem>
                            <FormLabel>College Roll No</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <div className="flex items-center rounded-md border border-input bg-gray-100 px-3 py-2 text-sm text-muted-foreground h-9 cursor-not-allowed">
                                        {defaultValue?.collegeRollNo ?? ""}
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                        {/* Name (Read-only, styled like dropdown) */}
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <div className="flex items-center rounded-md border border-input bg-gray-100 px-3 py-2 text-sm text-muted-foreground h-9 cursor-not-allowed">
                                        {defaultValue?.name ?? ""}
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                        {/* Course Dropdown */}
                        <FormField
                            control={form.control}
                            name="courseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courseOptions.map((course) => (
                                                <SelectItem value={course.courseId.toString()} key={course.courseId}>
                                                    {course.courseName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Status Dropdown */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statusOptions.map((status) => (
                                                <SelectItem value={status.Status} key={status.Id}>
                                                    {status.Status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Calendar Date Picker */}
                        <FormField
                            control={form.control}
                            name="dateMarked"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-row gap-4">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                className="rounded-md border"
                                                disabled={(date) => isAfter(date, new Date())}
                                                initialFocus={false}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="col-span-1 sm:col-span-3 flex justify-end">
                            <Button
                                type="button"
                                className="w-[128px]"
                                variant="outline"
                                onClick={() => router.push("/attendance")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="w-[128px] ms-4">
                                Update
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
}
