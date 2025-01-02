import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Students",
    description: "Student Screen",
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pe-4 ps-8">
            {children}
        </div>
    );
}