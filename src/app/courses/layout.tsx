import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses",
    description: "Course Screen",
};

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <div className="pe-4 ps-8">
            {children}
        </div>
    );
}