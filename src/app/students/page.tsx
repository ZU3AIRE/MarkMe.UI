import StudentGrid from "@/components/students/grid";
import { Student } from "../models/student";

export default async function Students() {
    let data: Student[] = [];
    try {
        const res = await fetch('https://localhost:7177/api/Student/GetAllStudents',)
        if (res.ok) {
            data = await res.json();
            data.map(student => {
                student.registrationNo = student.registrationNo.slice(0, 4) + '-' + student.registrationNo.slice(4, 7) + '-' + student.registrationNo.slice(7, 10);
                student.session = student.session.slice(0, 4) + '-' + student.session.slice(4, 8);
            })
        }
        else throw new Error("Failed to fetch students");
    }
    catch(err){
        console.error("Failed to fetch students", err);
    }
    return (
        <StudentGrid students={data} />
    );
}