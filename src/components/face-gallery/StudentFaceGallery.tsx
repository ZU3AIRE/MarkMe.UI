"use client"
import { Student } from "@/app/models/student";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import UpdateStudentFace from "./UpdateStudentFace";
import { Button } from "../ui/button";
import { toast } from "sonner";



export default function StudentFaceGallery({ token, students }: { token: string; students: Array<Student & { images?: string[]; isFaceEnrolled?: boolean }> }) {
    const [student, setStudents] = useState<Array<Student & { images?: string[]; isFaceEnrolled?: boolean }>>(students);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [updateDialog, setUpdateDialog] = useState<{ open: boolean; studentId?: number }>({ open: false });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; studentId?: number }>({ open: false });
    const fetchStudents = useCallback(async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetFaceGallery`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok && res.body) {
            setStudents(await res.json());
        } else {
            console.error("Failed to fetch students");
        }
    }, [token]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Dialog close handler for Escape key and outside click
    const handleDialogClose = (
        setter: (v: { open: boolean; studentId?: number }) => void
    ) => (e: React.MouseEvent | React.KeyboardEvent) => {
        if (e.type === 'keyup' && (e as React.KeyboardEvent).key === 'Escape') setter({ open: false });
        if (e.type === 'click' && e.target === e.currentTarget) setter({ open: false });
    };

    // Dedicated delete function
    const handleDeleteStudent = async (studentId?: number) => {
        if (!studentId) return;
        console.log("Deleting student with ID:", studentId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/DeleteFaces?studentId=${studentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'DELETE',
        });
        if (res.ok) {
            toast.success("Student deleted successfully");
        } else {
            toast.error("Failed to delete student");
        }

        setDeleteDialog({ open: false });
        fetchStudents();
    };

    return (
        <div className="flex flex-row pe-4 ps-8">
            {/* Gallery Section */}
            <div className="flex-1">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold mb-4">Student Faces Gallery</h1>
                                {/* Actions Section */}
            <div className="flex flex-row items-center justify-end min-w-[200px] pl-8 pt-8 gap-4">
                <Link href="/automark">
                    <Button variant="secondary" size="lg">Go to AutoMark</Button>
                </Link>
                <Link href={`/register-face`}>
                    <Button variant="outline" size="lg">Register Face</Button>
                </Link>
            </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {student.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16">
                            <Image src="/logo.png" alt="No faces" width={80} height={80} className="mb-4 opacity-40" />
                            <div className="text-lg font-semibold text-gray-500 mb-2">No faces registered or enrolled</div>
                            <div className="text-sm text-gray-400">Please register a face to see it here.</div>
                        </div>
                    ) : (
                        student.map((student) => {
                            const images = (student.images || ["/logo.png"]).slice(0, 4);
                            // If only one image, show name and buttons above image
                            if (images.length === 1) {
                                return (
                                    <div
                                        key={student.studentId}
                                        className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 border hover:shadow-lg transition"
                                    >
                                        <div className="text-center mb-2">
                                            <div className="font-semibold text-lg">
                                                {student.firstName} {student.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-1">Roll No: {student.collegeRollNo || student.universityRollNo || student.studentId}</div>
                                            <div className="text-xs text-gray-500 mb-2">{student.email}</div>
                                        </div>
                                        <div className="flex gap-2 mb-2">
                                            <Button variant="outline" size="sm" onClick={() => setUpdateDialog({ open: true, studentId: student.studentId })}>Update</Button>
                                            <Button variant="destructive" size="sm" onClick={() => setDeleteDialog({ open: true, studentId: student.studentId })}>Delete</Button>
                                        </div>
                                        <div className="w-20 h-20 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 cursor-pointer"
                                            onClick={() => images[0] && setSelectedImage(images[0])}
                                        >
                                            <Image
                                                src={images[0] || "/logo.png"}
                                                alt={student.firstName + " " + student.lastName + ` Face 1`}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                                priority
                                            />
                                        </div>
                                    </div>
                                );
                            }
                            // If three images, show details at bottom
                            if (images.length === 3) {
                                return (
                                    <div
                                        key={student.studentId}
                                        className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 border hover:shadow-lg transition"
                                    >
                                        <div className="grid grid-cols-3 gap-2 mb-2">
                                            {images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => img && setSelectedImage(img)}
                                                    className="w-20 h-20 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 cursor-pointer"
                                                >
                                                    <Image
                                                        src={img || "/logo.png"}
                                                        alt={student.firstName + " " + student.lastName + ` Face ${idx + 1}`}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                        priority={idx === 0}
                                                        loading={idx === 0 ? undefined : "lazy"}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-2">
                                            <div className="font-semibold text-lg">
                                                {student.firstName} {student.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-1">Roll No: {student.collegeRollNo || student.universityRollNo || student.studentId}</div>
                                            <div className="text-xs text-gray-500 mb-2">{student.email}</div>
                                            <div className="flex gap-2 mt-2 justify-center">
                                                <Button variant="outline" size="sm" onClick={() => setUpdateDialog({ open: true, studentId: student.studentId })}>Update</Button>
                                                <Button variant="destructive" size="sm" onClick={() => setDeleteDialog({ open: true, studentId: student.studentId })}>Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            // Default: name/details/buttons below images
                            return (
                                <div
                                    key={student.studentId}
                                    className="bg-white rounded-lg shadow p-4 flex flex-col items-center gap-2 border hover:shadow-lg transition"
                                >
                                    <div className={`grid grid-cols-${images.length === 2 ? 2 : 2} gap-2 mb-2`}>
                                        {images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => img && setSelectedImage(img)}
                                                className="w-20 h-20 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-blue-400 cursor-pointer"
                                            >
                                                <Image
                                                    src={img || "/logo.png"}
                                                    alt={student.firstName + " " + student.lastName + ` Face ${idx + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                    priority={idx === 0}
                                                    loading={idx === 0 ? undefined : "lazy"}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center mt-2">
                                        <div className="font-semibold text-lg">
                                            {student.firstName} {student.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">Roll No: {student.collegeRollNo || student.universityRollNo || student.studentId}</div>
                                        <div className="text-xs text-gray-500 mb-2">{student.email}</div>
                                        <div className="flex gap-2 mt-2 justify-center">
                                            <Button variant="outline" size="sm" onClick={() => setUpdateDialog({ open: true, studentId: student.studentId })}>Update</Button>
                                            <Button variant="destructive" size="sm" onClick={() => setDeleteDialog({ open: true, studentId: student.studentId })}>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            {/* Modal for image preview */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                    onClick={handleDialogClose(() => setSelectedImage(null))}
                    onKeyDown={handleDialogClose(() => setSelectedImage(null))}
                    tabIndex={0}
                >
                    <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col items-center">
                        <Image src={selectedImage} alt="Student Face" width={320} height={320} className="object-cover rounded-lg" />
                        <Button variant="outline" className="mt-4" onClick={() => setSelectedImage(null)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
            {/* Update Dialog */}
            {updateDialog.open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                    onClick={handleDialogClose(setUpdateDialog)}
                    onKeyDown={handleDialogClose(setUpdateDialog)}
                    tabIndex={0}
                >
                    <div className="bg-white rounded-lg p-6 shadow-lg min-w-[320px]">
                        {(() => {
                            const s = student.find(stu => String(stu.studentId) === String(updateDialog.studentId));
                            if (!s) return null;
                            return (
                                <UpdateStudentFace student={s} token={token} onClose={() => { setUpdateDialog({ open: false }); fetchStudents(); }} />
                            );
                        })()}
                    </div>
                </div>
            )}
            {/* Delete Dialog */}
            {deleteDialog.open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                    onClick={handleDialogClose(setDeleteDialog)}
                    onKeyDown={handleDialogClose(setDeleteDialog)}
                    tabIndex={0}
                >
                    <div className="bg-white rounded-lg p-6 shadow-lg min-w-[320px]">
                        <h2 className="text-lg font-semibold mb-4">Delete Student Face</h2>
                        {(() => {
                            const s = student.find((stu: Student) => String(stu.studentId) === String(deleteDialog.studentId));
                            return (
                                <div className="mb-4">
                                    Are you sure you want to delete <span className="font-bold">{s?.firstName} {s?.lastName}&apos;s</span> faces?
                                </div>
                            );
                        })()}
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteStudent(deleteDialog.studentId)}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
