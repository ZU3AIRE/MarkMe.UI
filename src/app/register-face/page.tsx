import { auth } from "@clerk/nextjs/server";
import { StudentDropDown } from "../models/student";
import RegisterStudentFace from "@/components/face-gallery/register";

export default async function UploadFaceImage() {
        let students: StudentDropDown[] = [];
        const { getToken } = await auth();
        const token = await getToken({ template: 'mark_me_backend_api' });
        if (token === null) return null;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}Student/GetStudentsName`,)
            if (res.ok) {
                students = await res.json();
            }
            else throw new Error("Failed to fetch students");
        }
        catch (err) {
            console.error("Failed to fetch students", err);
        }

  return (
    <>
    <RegisterStudentFace studentsData={students} token={token}/>
    </>
  );
}
