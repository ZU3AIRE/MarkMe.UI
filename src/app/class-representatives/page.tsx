import CRsCardGrid from "@/components/class-representatives/crs-card-grid"
import { CRModel } from '../models/class-representative'

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

    const crs: CRModel[] = await get('https://localhost:7177/api/cr/getallcrs');
    return (
        <>
            <div className="pe-4 ps-8">
                <div className="flex items-center justify-between py-4">
                    <h1 className="text-2xl font-semibold mb-4">
                        Class Representatives
                    </h1>
                </div>
            </div>
            <CRsCardGrid classRepresentatives={crs} />
        </>
    )
}


export default ClassRepresentatives

const get = async (url: string) => {
    try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
        else throw new Error("Failed to fetch students");
    }
    catch (err) {
        console.error("❌ ", err);
    }
}