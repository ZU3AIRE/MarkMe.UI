import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Attendance",
    description: "Attendance Screen",
};

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pe-4 ps-8">
            {children}
        </div>
    );
}