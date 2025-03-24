import { DEFAULT_STUDENT, Student } from "@/app/models/student";
import { StudentForm } from "@/components/students/form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Update - Student"
};

export default async function UpdateStudentPage({ params }: { params: Promise<{ key: number }> }) {
    const key = (await params).key;
    let student: Student = { ...DEFAULT_STUDENT };
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Student/GetStudentById/${key}`)
        if (res.ok) student = await res.json();
        else throw new Error("Failed to fetch student");
        console.log("✅ ", student);
    }
    catch(err){
        console.error("❌ ", err);
    }
    return (
        <StudentForm defaultValue={ student } mode ={'update'}  />
    );
}