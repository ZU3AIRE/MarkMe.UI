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
    dateMarked: Date;
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

export interface AttendanceResponse{
    message: string;
    invalidRollNumbers?: string[];
}