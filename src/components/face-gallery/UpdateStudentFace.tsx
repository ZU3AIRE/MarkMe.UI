"use client";
import React, { useState, ChangeEvent, DragEvent, FormEvent } from "react";
import { Button, Label, Input } from "../ui";
import Image from "next/image";
import { toast } from "sonner";
import { Student } from "@/app/models/student";

export default function UpdateStudentFace({ student, token, onClose }: { student: Student, token: string, onClose: () => void }) {
    const [images, setImages] = useState<File[]>([]);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files)
            .filter((f) => f.type.startsWith("image/"))
            .slice(0, 4);
        setImages(files);
    };

    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        images.forEach((img) => formData.append('images', img));
        console.log("Submitting images for studentId:", student.studentId);
        console.log("Images:", images);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/UpdateFace?StudentId=${student.studentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'POST',
            body: formData,
        });
        if (res.ok) {
            toast.success("Face images updated successfully!");
            setImages([]);
            onClose();
        } else {
            toast.error("Failed to update face images.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Update Face for {student.firstName} {student.lastName}</h2>
            <Label htmlFor="picture">Upload New Face Images</Label>
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
                <label htmlFor="picture" className="cursor-pointer flex flex-col items-center">
                    <span className="text-gray-500 mb-2">
                        Drag & drop images here, or <span className="text-blue-600 underline">browse</span>
                    </span>
                    <span className="text-xs text-gray-400">(Max 4 images)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((img, idx) => (
                        <span key={idx} className="flex flex-col items-center text-xs bg-gray-100 px-2 py-1 rounded">
                            <Image src={URL.createObjectURL(img)} alt={img.name} width={64} height={64} className="w-16 h-16 object-cover rounded mb-1 border" style={{ maxWidth: 64, maxHeight: 64 }} />
                            {img.name}
                        </span>
                    ))}
                    {images.length > 0 && (
                        <Button type="button" className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 ml-2" variant="destructive" onClick={() => setImages([])}>
                            Clear Images
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex gap-2 mt-2">
                <Button type="submit" className="w-full">Update Face Images</Button>
                <Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
            </div>
        </form>
    );
}
