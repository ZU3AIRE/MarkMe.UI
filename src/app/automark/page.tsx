"use client"
import AttendanceList from "@/components/AttendanceList";
import VideoStream from "@/components/VideoStream";
import styles from "@/styles/Home.module.css";
import { useState } from "react";


export default function AutoMarkPage() {
  const [attendance, setAttendance] = useState<Array<{
    faceId: string;
    timestamp: Date;
    type: 'check-in' | 'check-out';
  }>>([]);
  
  const handleFaceEvent = (faceId: string, type: 'check-in' | 'check-out') => {
    setAttendance(prev => [...prev, {
      faceId,
      timestamp: new Date(),
      type
    }]);
  };
  return (
      <div className="pe-4 ps-8">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-semibold mb-4">AI Powered Attendance Marking</h1>
        </div>
        <div className={styles.main}>
        <VideoStream onFaceEvent={handleFaceEvent} />
        <AttendanceList records={attendance} />
      </div>
      </div>
  );
}
