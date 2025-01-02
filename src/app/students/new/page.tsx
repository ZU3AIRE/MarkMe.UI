import { DEFAULT_STUDENT } from "@/app/models/student";
import { StudentForm } from "@/components/students/form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New - Student"
};
export default function RegisterStudent() {

    return (
        <StudentForm formData={DEFAULT_STUDENT} />
    );
}

