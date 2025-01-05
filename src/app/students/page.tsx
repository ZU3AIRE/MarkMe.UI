import StudentGrid from "@/components/students/grid";
import { Student } from "../models/student";

export default async function Students() {
    async function getStudents() {
        const students: Student[] = [
            { id: 1, firstName: 'John', lastName: 'Doe', collegeRollNo: '1234', universityRollNo: '5678', registrationNo: '2021-gsr-423', session: '2021-2025', section: 'A' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', collegeRollNo: '1235', universityRollNo: '5679', registrationNo: '2020-gsr-424', session: '2020-2024', section: 'B' },
            { id: 3, firstName: 'Bob', lastName: 'Wilson', collegeRollNo: '1236', universityRollNo: '5680', registrationNo: '2022-gsr-345', session: '2022-2026', section: 'C' },
        ];

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 4000));
        return students;
   }
  
    const students = await getStudents();


    return (
        <StudentGrid students={students} />
    );
}