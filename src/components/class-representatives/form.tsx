"use client"

import { StudentModel } from "@/app/class-representatives/page";
import { CRModel } from "@/app/models/class-representative";
import { CourseModel } from "@/app/models/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect } from "react";


type AddUpdateFomProps = {
    defaultValues: FormData,
    children: ReactNode,
    mode: "add" | "update",
    updateNominee: StudentModel | undefined,
    onSuccess: () => void,
    token: string
}

const FormSchema = z.object({
    studentId: z.preprocess((x) => parseInt(x as unknown as string), z.number().int().positive()),
    courseIds: z.number().array(),
})

export type FormData = z.infer<typeof FormSchema>

export default function AddUpdateForm({ children, defaultValues, mode, updateNominee, onSuccess, token }: AddUpdateFomProps) {

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            studentId: defaultValues.studentId === 0 ? undefined : defaultValues.studentId,
            courseIds: defaultValues.courseIds.filter(x => x !== 0) ?? []
        }
    });

    const [nominees, setNominees] = useState<StudentModel[]>([]);
    const [courses, setCourses] = useState<CourseModel[]>([]);

    const onNominate = (formData: FormData) => {
        post<CRModel | null>('https://localhost:7177/api/cr/nominatecr', JSON.stringify(formData),
            (data) => {
                if (!data) return;
                toast.success(`${data.firstName} ${data.lastName} has been nominated as CR.`);
                onSuccess();
            },
            token
        )
    }

    const onUpdate = (formData: FormData) => {
        postOnly('https://localhost:7177/api/cr/updatecr', JSON.stringify(formData),
            () => {
                toast.success(`${updateNominee?.firstName} ${updateNominee?.lastName} has been updated successfully.`);
                onSuccess();
            },
            token
        )
    }

    useEffect(() => {
        if (mode === "add") loadNominees(setNominees, token)
        else setNominees([updateNominee!]);

        loadCourses(setCourses, token);
    }, [mode, updateNominee, token])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(mode === "add" ? onNominate : onUpdate)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={defaultValues.studentId !== 0}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select any of your student" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {nominees.map((student, index) => (
                                        <SelectItem key={index} value={student?.studentId.toString()}>
                                            {student?.firstName}{" "}{student?.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <div>
                    <FormLabel className="pt-4">Courses</FormLabel>
                    <ScrollArea className="h-[320px] p-4 border border-gray-200 rounded-lg">
                        {courses.map((course, index) => (
                            <div
                                key={index}
                                className="mb-4"
                            >
                                <FormField
                                    control={form.control}
                                    name={`courseIds`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4  shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value.includes(course.courseId)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange([...new Set([...field.value, course.courseId])]);
                                                        }
                                                        else {
                                                            field.onChange(field.value.filter((id) => id !== course.courseId));
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    {course.code}
                                                </FormLabel>
                                                <FormDescription>
                                                    {course.title}
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                {children}
            </form>
        </Form>
    )
}


const loadNominees = (setter: (data: StudentModel[]) => void, token: string) =>
    get<StudentModel[]>('https://localhost:7177/api/student/getcrnominees', setter, token);

const loadCourses = (setter: (data: CourseModel[]) => void, token: string) =>
    get<CourseModel[]>('https://localhost:7177/api/course/getallcourses', setter, token);

export function get<T>(url: string, cb: (data: T) => void, token: string) {
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
            if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
            return res.json();
        })
        .then((data) => {
            cb(data);
        })
        .catch((err) => {
            console.error("Error in get request\n", err);
        });
}

function post<T>(url: string, body: string, cb: (data: T) => void, token: string) {
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }, body: body })
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
                throw Error(`${response.status}: ${response.statusText}`);
            }
            return response.ok ? response.json() : null;
        }).then(cb)
        .catch((error: Error) => {
            toast.error("An error occurred while creating the course.");
            console.log('🐛 ', error);
        });
}

function postOnly(url: string, body: string, cb: () => void, token?: string) {
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }, body: body })
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
                throw Error(`${response.status}: ${response.statusText}`);
            }
        }).then(cb)
        .catch((error: Error) => {
            toast.error("An error occurred while creating the course.");
            console.log('🐛 ', error);
        });
}