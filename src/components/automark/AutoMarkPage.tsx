"use client"
import AttendanceList from "@/components/AttendanceList";
import VideoStream from "@/components/VideoStream";
import styles from "@/styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";


export default function AutoMarkPage({ token }: { token: string }) {
  const [attendance, setAttendance] = useState<Array<{
    faceId: string;
    timestamp: Date;
    status: 'present' | 'late';
  }>>([]);

  // Video streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  // Track when streaming started
  const streamStartTimeRef = useRef<Date | null>(null);

  // Course dropdown state
  const [courses, setCourses] = useState<Array<{ courseId: number; courseCode: string; courseName: string }>>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  useEffect(() => {
    // Fetch courses for dropdown
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Course/GetAllCourses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Map to dropdown model
          type RawCourse = {
            courseId: number;
            code?: string;
            courseCode?: string;
            title?: string;
            courseName?: string;
          };
          setCourses(
            (data as RawCourse[]).map((c) => ({
              courseId: c.courseId,
              courseCode: c.code || c.courseCode || "",
              courseName: c.title || c.courseName || "",
            }))
          );
        }
      } catch  {
        // Optionally handle error
      }
    };
    fetchCourses();
  }, [token]);

  // Add attendance to backend when a new record is inserted
  const handleFaceEvent = async (faceId: string, type: 'check-in' | 'check-out') => {
    if (type === 'check-out') return; // Ignore check-out events
    const timestamp = new Date();
    let status: 'present' | 'late' = 'present';
    if (streamStartTimeRef.current) {
      const diffMs = timestamp.getTime() - streamStartTimeRef.current.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes > 10) {
        status = 'late';
      }
    }
    setAttendance(prev => [...prev, { faceId, timestamp, status }]);

    // 2 = present, 4 = late
    const apiStatus = status === 'present' ? 2 : 4;
    const pad = (n: number) => n.toString().padStart(2, "0");
    const localDateString = `${timestamp.getFullYear()}-${pad(timestamp.getMonth() + 1)}-${pad(timestamp.getDate())}T${pad(timestamp.getHours())}:${pad(timestamp.getMinutes())}:${pad(timestamp.getSeconds())}`;
    const body = {
      CourseId: parseInt(selectedCourseId),
      StudentsRollNos: faceId,
      Status: apiStatus,
      DateMarked: localDateString
    };
    try {
      console.log("\n\nCalling.....")
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/AddAttendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
    } catch {
      // Optionally handle error or show toast
    }
  };


  // Face upload functionality removed

  return (
    <div className="pe-4 ps-8">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold mb-4">AI Powered Attendance Marking</h1>
      </div>
      <div className={styles.main}>
        <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
          {/* Controls Section */}
          <div className="flex flex-col gap-4 min-w-[320px]">
            <label className="font-medium text-base">Select Course</label>
            <Select onValueChange={setSelectedCourseId} disabled={isStreaming}>
              <SelectTrigger className="w-full min-w-[250px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.courseId} value={c.courseId.toString()}>
                    {c.courseCode} - {c.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-4 mt-2">
              {!isStreaming ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 w-full"
                  onClick={() => {
                    setIsStreaming(true);
                    streamStartTimeRef.current = new Date();
                  }}
                  disabled={!selectedCourseId}
                >
                  Start
                </Button>
              ) : (
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
                  onClick={() => {
                    setIsStreaming(false);
                    streamStartTimeRef.current = null;
                  }}
                >
                  Pause
                </Button>
              )}
            </div>
          </div>
          {/* Video Stream Section */}
          <div className="flex-1 flex flex-col items-center">
            {isStreaming ? (
              <div className="w-full max-w-xl border rounded-lg shadow p-2 bg-black">
                <VideoStream onFaceEvent={handleFaceEvent} />
              </div>
            ) : (
              <div className="w-full max-w-xl border rounded-lg shadow p-8 flex items-center justify-center text-gray-400 bg-gray-50 min-h-[240px]">
                <span>Video stream will appear here after you start</span>
              </div>
            )}
          </div>
        </div>
        {/* Attendance List Section */}
        <div className="mt-8">
          <AttendanceList records={attendance} />
        </div>
      </div>
    </div>
  );
}
