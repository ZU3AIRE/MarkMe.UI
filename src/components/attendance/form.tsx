import { CourseDropdownModel } from "@/app/models/attendance";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { AttendanceResponse } from '../../app/models/attendance';

export default function MarkAttendance({ courses, handleMarkAttend, token }: { courses: CourseDropdownModel[], handleMarkAttend: (data: AttendanceResponse) => void, token: string }) {
    // States
    const [studentsRollNos, setRollNo] = React.useState<string>("")
    const [courseId, setCourseId] = React.useState<string>("")

    const body = {
        CourseId: courseId === "" ? 0 : parseInt(courseId),
        StudentsRollNos: studentsRollNos
    }

    const markAttendance = () => {
        console.log(body);
        const data = fetch(`https://localhost:7177/api/Attendance/AddAttendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                        case 400:
                            toast.error("Invalid data was provided.");
                            break;
                        case 500:
                            toast.error("Internal server error occurred.");
                            break;
                        default:
                            toast.error("An error occurred while marking attendance.");
                            break;
                    }
                }
                return response.ok ? response.json() : null;
            })
            .catch((error: Error) => {
                toast.error("An error occurred while marking the attendacne.");
                console.log('🐛 ', error);
            });
        data.then((d: AttendanceResponse) => {
            handleMarkAttend(d);
        });
    }
    return (
        <div>
            <div className="flex flex-col gap-4 items-end">
                <Select
                    onValueChange={(value) => setCourseId(value)}
                >
                    <SelectTrigger className="w-[450px]">
                        <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map((c) => (
                            <SelectItem key={c.courseId} value={c.courseId.toString()}
                            >
                                {c.courseCode} - {c.courseName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input className="w-[450px]" placeholder="Enter comma separated roll numbers"
                    value={studentsRollNos}
                    onChange={(e) => setRollNo(e.target.value)}
                />
                <Button onClick={markAttendance} > Mark Attendance</Button>
            </div>
        </div>

    )
}