"use client";
import { Label, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export type UpdateFormState = { error: string[] };
export type UpdateFormData = { title: string; teacher: string; courseCode: string };
const initialState: UpdateFormState = {
    error: []
};

const onSubmit = (state: UpdateFormState, formData: FormData) => {
    const courseCode = formData.get('courseCode') as string;
    const title = formData.get('title') as string;
    const teacher = formData.get('teacher') as string;
    const semester = parseInt(formData.get('semester') as string);
    const creditHours = parseInt(formData.get('creditHours') as string);
    const creditHoursPerWeek = parseInt(formData.get('creditHoursPerWeek') as string);
    const courseType = parseInt(formData.get('courseType') as string);

    const errors: string[] = [];
    if (!courseCode) errors.push("Course Code is required.");
    if (!title) errors.push("Course Title is required.");
    if (!teacher) errors.push("Teacher's Name is required.");
    if (!semester) errors.push("Semester is required.");
    if (!creditHours) errors.push("Credit Hours is required.");
    if (!creditHoursPerWeek) errors.push("Credit Hours Per Week is required.");
    if (!courseType) errors.push("Course Type is required.");

    // Save the course
    const course = {
        courseCode,
        title,
        teacher,
        semester,
        creditHours,
        creditHoursPerWeek,
        courseType
    };

    toast.success(course.title + " has been saved successfully.");
    redirect('/courses');
}

export function CourseForm({
    formData
}: { formData: UpdateFormData }) {
    const [actionState, onSubmitAction] = useActionState<UpdateFormState, FormData>(onSubmit, initialState);
    const [courseCode, setCourseCode] = useState<string>(formData.courseCode);
    const path = usePathname();

    return (
        <>
            <div className="flex items-center justify-between align-start py-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {path.startsWith('/courses/new') ? 'New Course' : formData.title ?? "NOT FOUND"}
                    </h1>
                    {path.startsWith('/courses/update/') && formData.courseCode ? <p className="text-sm text-muted-foreground">~ {formData.courseCode.slice(0, 2) + "-" + formData.courseCode.slice(2)}</p> : ""}
                </div>
                <Link href="/courses">
                    <Button variant="outline">
                        <ArrowLeftIcon /> Back
                    </Button>
                </Link>
            </div>
            <form action={onSubmitAction}>
                <div>
                    {actionState.error.map((error) => (
                        <div key={error}>{error}</div>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-8 mt-4">
                    <div className="col-span-3">
                        <Label htmlFor="courseCode">Course Code</Label>
                        <InputOTP maxLength={6} name="courseCode" value={courseCode} onChange={(v: string) => { setCourseCode(v) }} >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                            type="title"
                            name="title"
                            defaultValue={formData.title}
                            placeholder="The course title. e.g., Data Structures"
                        />
                    </div>

                    <div>
                        <Label htmlFor="courseType">Course Type</Label>
                        <Select name="courseType" defaultValue="0" >
                            <SelectTrigger >
                                <SelectValue placeholder="Select course type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Course Type</SelectLabel>
                                    <SelectItem value="0" >Minor</SelectItem>
                                    <SelectItem value="1">Major</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="teacher">Teacher&apos;s Name</Label>
                        <Input
                            type="text"
                            name="teacher"
                            defaultValue={formData.teacher}
                            placeholder="The teacher's name. e.g., Zubair Jamil"
                        />
                    </div>
                    <div >
                        <Label htmlFor="semester">Semester</Label>
                        <Input
                            type="number"
                            name="semester"
                            defaultValue={1}
                            min={1}
                            max={8}
                            placeholder="The semester number. e.g., 1"
                        />
                    </div>
                    <div >
                        <Label htmlFor="creditHours">Credit Hours</Label>
                        <Input
                            type="number"
                            name="creditHours"
                            defaultValue={25}
                            min={20}
                            max={60}
                            placeholder="The credit hour alloted to this course. e.g., 25"
                        />
                    </div>
                    <div >
                        <Label htmlFor="creditHoursPerWeek">Credit Hours Per Week</Label>
                        <Input
                            type="number"
                            name="creditHoursPerWeek"
                            defaultValue={3}
                            min={1}
                            max={12}
                            placeholder="The credit hour per week. e.g., 3"
                        />
                    </div>
                    <div className="col-span-3 flex justify-end">
                        <Button type="button" className="w-[128px]" variant={'outline'} onClick={() => redirect('/courses')}>Cancel</Button>
                        <Button type="submit" className="w-[128px] ms-4">Save</Button>
                    </div>
                </div>
            </form>
        </>
    );
}
