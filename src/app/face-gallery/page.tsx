import { auth } from "@clerk/nextjs/server";
import StudentFaceGallery from '../../components/face-gallery/StudentFaceGallery';
import { Student } from "../models/student";

export default async function UploadFaceImage() {
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;
    type StudentFaceGalleryProps = {
    students: Array<Student & { images?: string[]; }>;
    };
    let data: StudentFaceGalleryProps | null = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetFaceGallery`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) data = await res.json();
        else throw new Error("Failed to fetch Faces");
    }
    catch (err) {
        console.error("Failed to fetch Faces", err);
    }

    return (
        <>
            <StudentFaceGallery token={token} students={data?.students || []} />
        </>
    );
}
