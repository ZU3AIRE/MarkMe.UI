import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { IStudent } from "../models/student"
import { formSchema } from "./add-student"

export function UpdateStudent({
    student,
    onSave
}: {
    student: IStudent;
    onSave: (student: IStudent | null) => void;
}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: student,
    })

    const updateStudent = (student: IStudent, studentId: number) => {
        const data: IStudent[] = JSON.parse(window.localStorage.getItem('students') || '[]') || [];
        const stdIndex = data.findIndex((std) => std.id === studentId);
        if (stdIndex !== -1) {
            data[stdIndex] = { ...data[stdIndex], ...student };;
            window.localStorage.setItem("students", JSON.stringify(data));
            return data[stdIndex]
        }
        return null;
    }

    function onSubmit(values: IStudent) {
        onSave(updateStudent(values, student.id));
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
                                Give student&apos;s Full Name.
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
                                Give student&apos;s email address.
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
                                <Input type="number" placeholder="502" {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value ? parseInt(value) : 0);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Give student&apos;s College Roll No.
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
                                <Input type="number" placeholder="070986" {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value ? parseInt(value) : 0);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Give student&apos;s University Roll No.
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
                                Give student&apos;s Session.
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
                                Give student&apos;s Phone Number.
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
                                Give student&apos;s Current Semester.
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
                                Give student&apos;s Attendance.
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
