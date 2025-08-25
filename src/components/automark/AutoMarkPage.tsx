"use client"
import AttendanceList from "@/components/AttendanceList";
import VideoStream from "@/components/VideoStream";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

export default function AutoMarkPage({ token }: { token: string }) {
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

  // Allow multiple images
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!images.length) return;
    const formData = new FormData();
    images.forEach((img) => {
      formData.append("images", img); // backend should accept array or handle multiple files
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}Attendance/UploadFace/upload-face?studentId=2`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    console.log("Response:", response);
  };

  return (
    <div className="pe-4 ps-8">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold mb-4">AI Powered Attendance Marking</h1>
      </div>
      <div className={styles.main}>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                // Only allow up to 4 images
                const selected = Array.from(files).slice(0, 4);
                setImages(selected);
              }
            }}
            required
          />
          <div className="flex gap-2 mt-2 items-center">
            {images.map((img, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {img.name}
              </span>
            ))}
            {images.length > 0 && (
              <button
                type="button"
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 ml-2"
                onClick={() => setImages([])}
              >
                Clear Images
              </button>
            )}
          </div>
          <button type="submit" className="mt-2">Upload Face Images</button>
        </form>
        <VideoStream onFaceEvent={handleFaceEvent} />
        <AttendanceList records={attendance} />
      </div>
    </div>
  );
}
