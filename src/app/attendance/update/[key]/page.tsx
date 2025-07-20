import { ATTENDANCE_STATUS, CourseDropdownModel, DEFAULT_ATTENDANCE, IAttendance } from "@/app/models/attendance";
import AttendanceEditForm from "@/components/attendance/update";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Update - Attendance"
};

export default async function UpdateAttendancePage({ params }: { params: Promise<{ key: number }> }) {
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;
    const key = (await params).key;
    let data: IAttendance = { ...DEFAULT_ATTENDANCE };
    let courseOptions: CourseDropdownModel[] = [];



    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetCourses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) courseOptions = await res.json();
        else throw new Error("Failed to fetch courses");
    }
    catch (err) {
        console.error("Failed to fetch courses", err);
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAttendanceById/${key}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) data = await res.json();
        else throw new Error("Failed to fetch attendance");
    }
    catch (err) {
        console.error("❌ ", err);
    }
        data.dateMarked = new Date(data.dateMarked).toLocaleString();
        data.status = ATTENDANCE_STATUS.find((s) => s.Id === parseInt(data.status))?.Status || data.status;

    return (
        <AttendanceEditForm defaultValue={data} token={token} courses={courseOptions} />
    );
}