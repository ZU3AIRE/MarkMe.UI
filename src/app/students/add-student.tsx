import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { IStudent, Students } from "../model/student"


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(1, {
        message: "You must give an email address",
    }).email("This is not a valid email address"),
    collegeRollNo: z.string().min(1, {
        message: "You must give a college roll number",
    }),
    universityRollNo: z.string().min(4, {
        message: "You must give a university roll number",
    }),
    session: z.string().min(4, {
        message: "You must give a session",
    }),
    phoneNumber: z.string().min(3, {
        message: "You must give a phone number",
    }),
    currentSemester: z.string().min(1, {
        message: "You must give a current semester",
    }),
    attendance: z.string().min(1, {
        message: "You must give an attendance",
    }),
})

const registerStudent = (student: any) => {
    var data: IStudent[] = JSON.parse(window.localStorage.getItem('students') || '[]') || [];
    const newStudent = new Students(
        student.name,
        student.email,
        student.collegeRollNo,
        student.universityRollNo,
        student.session,
        student.phoneNumber,
        student.currentSemester,
        student.attendance);
    data.push(newStudent);
    window.localStorage.setItem('students', JSON.stringify(data));
}


export function RegisterStudent({ onSave }: { onSave: () => void }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            collegeRollNo: "",
            universityRollNo: "",
            session: "",
            phoneNumber: "",
            currentSemester: "",
            attendance: "",
        },
    })

    function onSubmit(values: any) {
        console.log(values);
        registerStudent(values);
        onSave();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="name" placeholder="Mousa" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's Full Name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="asad@gmail.com..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's email address.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="collegeRollNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>College Roll No</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="502" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's College Roll No.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="universityRollNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>University Roll No</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="070986" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's University Roll No.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="session"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="2021-2025" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's Session.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="0301-1234567" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's Phone Number.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="currentSemester"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Semester</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="8th" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's Current Semester.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="attendance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attendance</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="60%" {...field} />
                            </FormControl>
                            <FormDescription>
                                Give student's Attendance.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
