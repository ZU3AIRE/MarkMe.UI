import CRMainGrid from "@/components/class-representatives/main-grid";
import { auth } from '@clerk/nextjs/server';
import { CRModel } from '../models/class-representative';

export type StudentModel = {
    studentId: number;
    collegeRollNo: string;
    universityRollNo: string;
    registrationNo: string;
    firstName: string;
    lastName: string;
    session: string;
    section: string;
}

const ClassRepresentatives = async () => {
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;

    const crs: CRModel[] = await get(`${process.env.NEXT_PUBLIC_BASE_URL}cr/getallcrs`, token);
    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold mb-4">
                        Class Representatives
                    </h1>
                </div>
            </div>
            <CRMainGrid classRepresentatives={crs} token={token} />
        </>
    )
}


export default ClassRepresentatives

const get = async (url: string, token: string | null) => {
    try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) return await res.json();
        else throw new Error("Failed to fetch" + res.status);
    }
    catch (err) {
        console.error("❌ ", err);
    }
}