export interface IAttendance {
    attendanceId: number;
    studentId: number
    courseId: number;
    name: string;
    collegeRollNo: string;
    universityRollNo: string;
    courseCode: string;
    courseTitle: string;
    semester: number;
    dateMarked: string;
    markedBy: string;
    status: string;
    // isDeleted: boolean;
    // isArchived: boolean;
}

export type CourseDropdownModel = {
    courseId: number;
    courseCode: string;
    courseName: string;
}

export class AttendnaceStatusModel {
    Id!: number;
    Status!: string;
}
export interface AttendanceResponse {
    message?: string;
    invalidRollNumbers?: string[];
}

export const ATTENDANCE_STATUS: AttendnaceStatusModel[] = [
    { Id: 1, Status: "Absent" },
    { Id: 2, Status: "Present" },
    { Id: 3, Status: "Leave" },
    { Id: 4, Status: "Late" },
]