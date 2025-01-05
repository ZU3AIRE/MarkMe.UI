import { Student } from "@/app/models/student";
import { StudentForm } from "@/components/students/form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Update - Student"
};

export default async function UpdateStudentPage({ params }: { params: Promise<{ key: number }> }) {
    const key = (await params).key;
    const students: Student[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', collegeRollNo: '1234', universityRollNo: '5678', registrationNo: '2021gsr423', session: '20212025', section: 'A' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', collegeRollNo: '1235', universityRollNo: '5679', registrationNo: '2020gsr424', session: '20202024', section: 'B' },
        { id: 3, firstName: 'Bob', lastName: 'Wilson', collegeRollNo: '1236', universityRollNo: '5680', registrationNo: '2022gsr345', session: '20222026', section: 'C' },
    ];

    // Load Course from backend
    const student = await new Promise<Student>(resolve => setTimeout(() => { resolve(students.find(x => x.id == key)!) }, 4000));

    return (
        <StudentForm formData={{ ...student }} />
    );
}