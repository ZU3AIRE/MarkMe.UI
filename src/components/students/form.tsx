"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
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
import { redirect, usePathname } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


export type UpdateFormData = { firstName: string; lastName: string; collegeRollNo: string; universityRollNo: string; registrationNo: string; session: string; section: string; };

export const formSchema = z.object({
    firstName: z
        .string()
        .regex(/^[A-Za-z_]+$/, { message: "First Name can only contain alphabets and underscores." })
        .min(3, { message: "First Name must be at least 3 characters." }),

    lastName: z
        .string()
        .regex(/^[A-Za-z_]+$/, { message: "Last Name can only contain alphabets and underscores." })
        .min(3, { message: "Last Name must be at least 3 characters." }),

    collegeRollNo: z
        .string()
        .max(4, { message: "College Roll No cannot exceed 4 digits." })
        .min(1, { message: "The college roll no can't be negative or zero." })
        .refine((value) => /^[0-9]+$/.test(value), { message: "College Roll No must be numeric." }),

    universityRollNo: z
        .string()
        .max(10, { message: "University Roll No cannot exceed 10 digits." })
        .min(5, { message: "The university roll number must be at least 5 digits." })
        .refine((value) => /^[0-9]+$/.test(value), { message: "University Roll No must be numeric." }),

    registrationNo: z
        .string()
        .length(10, { message: "The registration number must be exactly 10 characters." }),

    session: z
        .string()
        .length(8, { message: "The session must have exactly 8 characters." }),

    section: z
        .string()
        .min(1, { message: "You must give a section." }),
});

const onSubmit = (formData: UpdateFormData) => {

    // Save the srtudent
    toast.success(formData.firstName + " has been saved successfully.");
    redirect('/students');
}

export function StudentForm({
    formData
}: { formData: UpdateFormData }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: formData,
    });
    const path = usePathname();

    return (
        <div className="flex flex-col gap-8 lg:p-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {path.startsWith("/students/new") ? "New Student" : formData.firstName ?? "NOT FOUND"}
                    </h1>
                    {path.startsWith("/students/update/") && formData.collegeRollNo ?
                        <p className="text-sm text-muted-foreground">~ {formData.collegeRollNo}</p> : ""}
                </div>
                <Link href="/students">
                    <Button variant="outline">
                        <ArrowLeftIcon /> Back
                    </Button>
                </Link>
            </div>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
                        <FormField
                            control={form.control}
                            name="collegeRollNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>College Roll No</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={4} {...field}>
                                            <InputOTPGroup>
                                                {Array.from({ length: 4 }, (_, index) => (
                                                    <InputOTPSlot key={index} index={index} />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
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
                                        <InputOTP maxLength={10} {...field}>
                                            <InputOTPGroup>
                                                {Array.from({ length: 10 }, (_, index) => (
                                                    <InputOTPSlot key={index} index={index} />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="registrationNo"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Registration No</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={10} {...field}>
                                                <InputOTPGroup>
                                                    {Array.from({ length: 4 }, (_, index) => (
                                                        <InputOTPSlot key={index} index={index} />
                                                    ))}
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    {Array.from({ length: 3 }, (_, index) => (
                                                        <InputOTPSlot key={index} index={index + 4} />
                                                    ))}
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    {Array.from({ length: 3 }, (_, index) => (
                                                        <InputOTPSlot key={index} index={index + 7} />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Doe" {...field} />
                                    </FormControl>
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
                                        <InputOTP maxLength={8} {...field}>
                                            <InputOTPGroup>
                                                {Array.from({ length: 4 }, (_, index) => (
                                                    <InputOTPSlot key={index} index={index} />
                                                ))}
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                {Array.from({ length: 4 }, (_, index) => (
                                                    <InputOTPSlot key={index} index={index + 4} />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="section"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="G1" {...field} />
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
                                onClick={() => redirect("/students")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="w-[128px] ms-4">
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
