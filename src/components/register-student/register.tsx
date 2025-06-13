"use client";
import React, { useState, ChangeEvent, DragEvent, FormEvent } from "react";
import { Button, Label, Input } from "../ui";
import { StudentDropDown } from '../../app/models/student';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { toast } from "sonner";
import Image from "next/image";

export default function RegisterStudentFace({ studentsData, token }: { studentsData: StudentDropDown[], token: string }) {
  const [images, setImages] = useState<File[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [students, setStudents] = useState<StudentDropDown[]>(studentsData);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 4);
    setImages(files);
  };

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB standard image size limit

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selected = Array.from(files)
        .filter(file => file.size <= MAX_IMAGE_SIZE)
        .slice(0, 4);

      if (selected.length < files.length) {
        toast.error("Some images exceed the 2MB size limit and were not added.");
      }

      setImages(selected);
    }
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('studentId', selectedStudent);
    images.forEach((img) => formData.append('images', img));
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/RegisterFace`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          switch (response.status) {
            case 400:
              toast.error("Invalid data was provided.");
              break;
            default:
              toast.error("An error occurred while deleting the course.");
              break;
          }
        }
        if (response.ok)
          toast.success("Face images uploaded successfully!");

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Student/GetStudentsName`)
          .then(res => {
            if (!res.ok) {
              switch (res.status) {
                case 400:
                  toast.error("Invalid data was provided.");
                  break;
                default:
                  toast.error("An error occurred while deleting the course.");
                  break;
              }
            }
            return res.ok ? res.json() : null;
          }).then(res => {
            setStudents(res);
          }).
          catch(err => {
            console.error("Failed to fetch courses", err);
          });
      })
      .catch((error: Error) => {
        toast.error("An error occurred while deleting the course.");
        console.log('🐛 ', error);
      });
  };


  return (
    <div className="pe-4 ps-8">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold mb-4">
          Student Face Registration
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow"
      >
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold mb-4">
            Student Face Registration
          </h2>
          <Label htmlFor="student">Select Student</Label>
          <Select
            value={selectedStudent}
            onValueChange={setSelectedStudent}
            required
          >
            <SelectTrigger id="student" className="border rounded px-3 py-2">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.studentId} value={student.studentId.toString()}>
                  {student.studentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="picture">Upload Face Images</Label>
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Input
              id="picture"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              required
            />
            <label
              htmlFor="picture"
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="text-gray-500 mb-2">
                Drag & drop images here, or{" "}
                <span className="text-blue-600 underline">browse</span>
              </span>
              <span className="text-xs text-gray-400">(Max 4 images)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <span
                  key={idx}
                  className="flex flex-col items-center text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded mb-1 border"
                    style={{ maxWidth: 64, maxHeight: 64 }}
                  />
                  {img.name}
                </span>
              ))}
              {images.length > 0 && (
                <Button
                  type="button"
                  className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 ml-2"
                  variant="destructive"
                  onClick={() => setImages([])}
                >
                  Clear Images
                </Button>
              )}
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full mt-2">
          Upload Face Images
        </Button>
      </form>
    </div>
  );
}