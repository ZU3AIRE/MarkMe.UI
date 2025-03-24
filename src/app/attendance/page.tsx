import AttendanceGrid from "@/components/attendance/grid";
import { auth } from "@clerk/nextjs/server";
import { ATTENDANCE_STATUS, CourseDropdownModel, IAttendance } from "../models/attendance";

export default async function Attendance() {
    let data: CourseDropdownModel[] = [];
    let attendances: IAttendance[] = [];
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetCourses`, {
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
        const attendanceRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAllAttendance`, {
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
    attendances = attendances.map((a) => {
        a.dateMarked = new Date(a.dateMarked).toLocaleString();
        a.status = ATTENDANCE_STATUS.find((s) => s.Id === parseInt(a.status))?.Status || a.status;
        return a;
    });
    return (<>
        <AttendanceGrid courses={data} attendances={attendances} token={token} />
    </>);
}

