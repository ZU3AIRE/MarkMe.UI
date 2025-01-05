"use client";
import { CourseModel, CourseType } from "@/app/models/course";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    code: z
        .string()
        .max(5, { message: "Must be of type XX-000" })
        .min(5, { message: "Must be of type XX-000" })
        .refine((value) => /^[A-Za-z][A-Za-z]\d\d\d/.test(value), { message: "Must be of type AB-100" }),

    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters." }),

    type: z.preprocess(
        (value) => parseInt(value as unknown as string),
        z.nativeEnum(CourseType)),

    semester: z.preprocess(
        (value) => parseInt(value as unknown as string),
        z.number().positive().min(1, { message: "You must give a current semester" })
    ),

    creditHours: z.preprocess(
        (value) => parseInt(value as unknown as string),
        z.number().min(3, { message: "Credit hours must be greater than 3" })
    ),

    creditHoursPerWeek: z.preprocess(
        (value) => parseInt(value as unknown as string),
        z.number().min(3, { message: "Credit hours per week must be greater than 3" })
    )
});

// 'code' | 'title' | 'type' | 'semester' | 'creditHours' | 'creditHoursPerWeek'
type courseModel = z.infer<typeof formSchema>;

export default function CourseForm({ defaultValue, mode }: { defaultValue?: CourseModel, mode: 'create' | 'update' }) {
    const router = useRouter();
    const onSubmit = (formData: courseModel) => {
        if (mode === 'create') {
            fetch('https://localhost:7177/api/Course/CreateCourse', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData) })
                .then(response => {
                    if (!response.ok) {
                        switch (response.status) {
                            case 400:
                                toast.error("Invalid data was provided.");
                                break;
                            default:
                                toast.error("An error occurred while creating the course.");
                                break;
                        }
                    }
                    return response.ok ? response.json() : null;
                })
                .then((data: CourseModel | null) => {
                    if (!data) return;

                    toast.success(`Course ${data.title} created successfully!`);
                    console.log("✅ Added: ", data);
                    router.push('/courses');
                })
                .catch((error: Error) => {
                    toast.error("An error occurred while creating the course.");
                    console.log('🐛 ', error);
                });
        }
        else {
            fetch(`https://localhost:7177/api/Course/UpdateCourse/${defaultValue?.courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ courseId: defaultValue?.courseId, ...formData }) })
                .then(response => {
                    if (!response.ok) {
                        switch (response.status) {
                            case 400:
                                toast.error("Invalid data was provided.");
                                break;
                            default:
                                toast.error("An error occurred while updating the course.");
                                break;
                        }
                    }
                    return response.ok ? response.json() : null;
                })
                .then((data: CourseModel | null) => {
                    if (!data) return;

                    toast.success(`Course ${data.title} updated successfully!`);
                    console.log("✅ Updated: ", data);
                    router.push('/courses');
                })
                .catch((error: Error) => {
                    toast.error("An error occurred while updating the course.");
                    console.log('🐛 ', error);
                });
        }
    }

    const form = useForm<courseModel>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValue,
    });

    return (
        <>
            <div className="flex items-center justify-between align-start py-4">
                <div>
                    <h1 className="text-2xl font-semibold">New Course</h1>
                </div>
                <Link href="/courses">
                    <Button variant="outline">
                        <ArrowLeftIcon /> Back
                    </Button>
                </Link>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="sm:my-4 lg:my-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Course Code</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={5} {...field}>
                                                <InputOTPGroup>
                                                    {Array.from({ length: 2 }, (_, index) => (
                                                        <InputOTPSlot key={index} index={index} />
                                                    ))}
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    {Array.from({ length: 3 }, (_, index) => (
                                                        <InputOTPSlot key={index} index={index + 2} />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Programming Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a valid type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={CourseType.MINOR.toString()}>Minor</SelectItem>
                                            <SelectItem value={CourseType.MAJOR.toString()}>Major</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="semester"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semester</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a valid semester" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.from({ length: 8 }, (_, index) => (<SelectItem value={(index + 1).toString()} key={index}>{index + 1}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="creditHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit Hours</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Credit Hours" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="creditHoursPerWeek"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit Hours Per Week</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Credit Hours Per Week" {...field} />
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
                                onClick={() => redirect("/courses")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="w-[128px] ms-4">
                                {mode === 'create' ? 'Submit' : 'Update'}
                            </Button>
                        </div>

                    </div>
                </form>
            </Form>
        </>
    );
}
