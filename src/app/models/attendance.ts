export interface IAttendance {
    attendanceId: string;
    name: string;
    collegeRollNumber: string;
    universityRollNumber: string;
    courseCode: string;
    courseTitle: string;
    attendedAt: string;
    markedBy: string;
    isDeleted: boolean;
    isArchived: boolean;
}