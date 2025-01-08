import CRsCardGrid from "@/components/class-representatives/crs-card-grid"
import { CRModel } from '../models/class-representative'
import { CourseModel } from "../models/course";

export type StudentModel = {
    studentId: number;
    collegeRollNo: string;
    universityRollNo: string;
    registrationNo: string;
    firstName: string;
    lastName: string;
    session: string;
    section: string;
}

const ClassRepresentatives = async () => {

    let crs: CRModel[] = [];
    try {
        const res = await fetch('https://localhost:7177/api/cr/getallcrs');
        if (res.ok) crs = await res.json();
        else throw new Error("Failed to fetch courses, " + res.statusText);
    }
    catch (err) {
        console.error("Failed to fetch courses", err);
    }

    let courses: CourseModel[] = [];
    try {
        const res = await fetch('https://localhost:7177/api/Course/GetAllCourses');
        if (res.ok) courses = await res.json();
        else throw new Error("Failed to fetch courses");
    }
    catch (err) {
        console.error("Failed to fetch courses", err);
    }

    const data = courses.map((x) => {
        return { value: x.courseId, label: x.title, code: x.code.substring(0, 2) + '-' + x.code.substring(2) };
    });

    let students: StudentModel[] = [];
    try {
        const res = await fetch('https://localhost:7177/api/Student/GetCRNominees');
        if (res.ok) students = await res.json();
        else throw new Error("Failed to fetch students");
    }
    catch (err) {
        console.error("Failed to fetch students", err);
    }

    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold mb-4">
                        Class Representatives
                    </h1>
                </div>
            </div>
            <CRsCardGrid classRepresentatives={crs} courses={data} students={students} />
        </>
    )
}

export default ClassRepresentatives