import MarkAttendance from "@/components/attendance/grid";
import { CourseDropdownModel, IAttendance } from "../models/attendance";
import { auth } from "@clerk/nextjs/server";

export default async function Attendance() {
    let data: CourseDropdownModel[] = [];
    let attendances: IAttendance[] = [];
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;

    try {
        const res = await fetch('https://localhost:7177/api/Attendance/GetCourses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) data = await res.json();
        else throw new Error("Failed to fetch courses");
    }
    catch (err) {
        console.error("Failed to fetch courses", err);
    }

    try {
        const attendanceRes = await fetch('https://localhost:7177/api/Attendance/GetAllAttendance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (attendanceRes.ok) attendances = await attendanceRes.json();
        else throw new Error("Failed to fetch attendances");
    }
    catch (err) {
        console.error("Failed to fetch attendances", err);
    }
    return (<>
        <MarkAttendance courses={data} attendances={attendances} />
    </>);
}

