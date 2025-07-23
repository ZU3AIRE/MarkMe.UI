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
import { isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
        const selectedDate = formData.dateMarked;
        const now = new Date();
        const combinedDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        );

        const pad = (n: number) => n.toString().padStart(2, "0");
        const localDateString = `${combinedDate.getFullYear()}-${pad(combinedDate.getMonth() + 1)}-${pad(combinedDate.getDate())}T${pad(combinedDate.getHours())}:${pad(combinedDate.getMinutes())}:${pad(combinedDate.getSeconds())}`;

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
                    AttendanceStatus: ATTENDANCE_STATUS.find((s) => s.Status === formData.status)?.Id || 0,
                    DateMarked: localDateString,
                })
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
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-lg p-8 shadow-md w-full">
                    <h2 className="text-2xl font-semibold text-center mb-8">Update Attendance</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col md:flex-row gap-12">
                                {/* Left side: Fields */}
                                <div className="flex-1 min-w-[260px] flex flex-col gap-6">
                                    {/* College Roll No */}
                                    <FormItem>
                                        <FormLabel>College Roll No</FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="rounded-md border border-input bg-gray-100 px-3 py-2 text-sm text-muted-foreground h-10 cursor-not-allowed w-full"
                                                value={defaultValue?.collegeRollNo ?? ""}
                                                readOnly
                                                disabled
                                            />
                                        </FormControl>
                                    </FormItem>
                                    {/* Name */}
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <input
                                                type="text"
                                                className="rounded-md border border-input bg-gray-100 px-3 py-2 text-sm text-muted-foreground h-10 cursor-not-allowed w-full"
                                                value={defaultValue?.name ?? ""}
                                                readOnly
                                                disabled
                                            />
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
                                                        {statusOptions.map((s) => (
                                                            <SelectItem key={s.Id} value={s.Status}>
                                                                {s.Status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Right side: Calendar and buttons */}
                                <div className="flex flex-col items-center gap-4 min-w-[320px]">
                                    <FormField
                                        control={form.control}
                                        name="dateMarked"
                                        render={({ field }) => (
                                            <FormItem className="w-full flex flex-col items-center">
                                                <FormLabel className="mb-2">Date</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            className="rounded-md border"
                                                            disabled={(date) =>
                                                                isAfter(date, new Date()) || date.getDay() === 0
                                                            }
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex justify-center gap-4 w-full mt-4">
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
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
