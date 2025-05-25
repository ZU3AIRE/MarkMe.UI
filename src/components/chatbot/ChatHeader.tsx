import { Trash } from "lucide-react";

export default function ChatHeader({ onClear }: { onClear: () => void }) {
    return (
        <div className="border-b border-gray-200 bg-white p-4 shadow-sm flex-shrink-0 z-10">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">AI Powered Attendance Reporting</h1>
                <button
                    onClick={onClear}
                    className="flex items-center gap-1 rounded-md p-2 text-sm hover:bg-gray-100"
                    title="Clear conversation"
                >
                    <Trash size={16} />
                    <span className="hidden sm:inline">Clear chat</span>
                </button>
            </div>
        </div>
    );
}