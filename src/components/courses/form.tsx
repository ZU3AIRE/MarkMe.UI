"use client";
import { Course, CreateCourseModel } from "@/app/models/course";
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
import { ApiError } from "next/dist/server/api-utils";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export type UpdateFormState = { error: string[] };
export type UpdateFormData = Course;
const initialState: UpdateFormState = {
    error: []
};

const onSubmit = (state: UpdateFormState, formData: FormData) => {
    "use client"
    const code = formData.get('code') as string;
    const title = formData.get('title') as string;
    const type = parseInt(formData.get('type') as string);
    const semester = parseInt(formData.get('semester') as string);
    const creditHours = parseInt(formData.get('creditHours') as string);
    const creditHoursPerWeek = parseInt(formData.get('creditHoursPerWeek') as string);
    const course: CreateCourseModel = {
        code,
        title,
        type,
        semester,
        creditHours,
        creditHoursPerWeek
    };

    try {
        console.log(course);
        fetch('https://localhost:7177/api/Course/CreateCourse', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(course) })
            .then(response => response.json())
            .then(data => {
                toast.success("🎉 Happy New Year!");
                console.log(data);
                redirect('/courses');
            });
    } catch (error) {
        if (error instanceof ApiError) {
            toast.error(error.message);
            console.log('\n🐛', error, '\n');
            return { error: error.message ? [error.message] : ["An error occurred."] };
        }
    }
    return { error: [] };
}
export function CourseForm({
    formData
}: { formData: UpdateFormData }) {
    const [actionState, onSubmitAction] = useActionState<UpdateFormState, FormData>(onSubmit, initialState);
    const [courseCode, setCourseCode] = useState<string>(formData.code ?? "UNDEFINED");
    const path = usePathname();

    return (
        <>
            <div className="flex items-center justify-between align-start py-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {path.startsWith('/courses/new') ? 'New Course' : formData.title ?? "NOT FOUND"}
                    </h1>
                    {path.startsWith('/courses/update/') && formData.code ? <p className="text-sm text-muted-foreground">~ {formData.code.slice(0, 2) + "-" + formData.code.slice(2)}</p> : ""}
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
                        <Label htmlFor="code">Course Code</Label>
                        <InputOTP maxLength={6} name="code" value={courseCode} onChange={(v: string) => { setCourseCode(v) }} >
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
                            defaultValue={formData.title ?? 'UNDEFINED'}
                            placeholder="The course title. e.g., Data Structures"
                        />
                    </div>

                    <div>
                        <Label htmlFor="type">Course Type</Label>
                        <Select name="type" >
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
                            step={5}
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
                            step={5}
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
