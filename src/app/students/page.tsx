import StudentGrid from "@/components/students/grid";
import { Student } from "../models/student";
import { auth } from "@clerk/nextjs/server";

export default async function Students() {
    let data: Student[] = [];
    let nomies: Student[] = [];
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;
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

        const respon = await fetch('https://localhost:7177/api/Student/GetCRNominees',)
        if (respon.ok) {
            nomies = await respon.json();
            nomies.map(student => {
                student.registrationNo = student.registrationNo.slice(0, 4) + '-' + student.registrationNo.slice(4, 7) + '-' + student.registrationNo.slice(7, 10);
                student.session = student.session.slice(0, 4) + '-' + student.session.slice(4, 8);
            })
        }
        else throw new Error("Failed to fetch nominees");
    }
    catch (err) {
        console.error("Failed to fetch nominees", err);
    }
    return (
        <StudentGrid students={data} nominees={nomies} token={token} />
    );
}