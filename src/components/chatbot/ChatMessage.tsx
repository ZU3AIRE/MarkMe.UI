import { Bot, User } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "./chat-bot";

type ParsedData = Record<string, unknown> | { data: Record<string, unknown>[] } | unknown[] | null;

function isDateString(value: unknown): boolean {
    if (typeof value !== "string") return false;
    return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?)?$/.test(value);
}

function formatDate(value: string): string {
    try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return format(date, "PPpp");
        }
        return value;
    } catch {
        return value;
    }
}

export default function ChatMessage({ message }: { message: Message }) {
    let parsed: ParsedData;
    try {
        parsed = JSON.parse(message.text);
    } catch {
        parsed = null;
    }

    return (
        <div className={`mb-6 ${message.type === "user" ? "flex justify-end" : ""}`}>
            <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${message.type === "bot"
                    ? "bg-gray-700 text-white"
                    : "bg-blue-500 text-white"
                }`}>
                    {message.type === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`rounded-lg py-2 ${message.type === "user" ? "text-right" : ""} max-w-[75%]`}>
                    {(() => {
                        if (
                            parsed &&
                            typeof parsed === "object" &&
                            parsed !== null &&
                            (Array.isArray((parsed as { data?: unknown[] }).data) || Array.isArray(parsed))
                        ) {
                            const rows = Array.isArray((parsed as { data?: unknown[] }).data)
                                ? (parsed as { data: unknown[] }).data
                                : (parsed as unknown[]);
                            if (rows.length === 0) {
                                return <pre className="whitespace-pre-wrap font-sans text-left">No data found.</pre>;
                            }
                            const columns = Array.from(
                                rows.reduce((set: Set<string>, row) => {
                                    if (typeof row === "object" && row !== null) {
                                        Object.keys(row).forEach((k) => set.add(k));
                                    }
                                    return set;
                                }, new Set<string>())
                            );
                            return (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-border rounded-xl shadow-sm bg-card text-card-foreground">
                                        <thead>
                                            <tr>
                                                {columns.map((col) => (
                                                    <th
                                                        key={col}
                                                        className="px-4 py-2 bg-muted text-muted-foreground font-semibold border-b border-border first:rounded-tl-xl last:rounded-tr-xl"
                                                    >
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-muted/60 transition-colors"
                                                >
                                                    {columns.map((col) => {
                                                        const value =
                                                            typeof row === "object" && row !== null
                                                                ? (row as Record<string, unknown>)[col]
                                                                : "";
                                                        return (
                                                            <td
                                                                key={col}
                                                                className="px-4 py-2 border-b border-border"
                                                            >
                                                                {typeof value === "string" && isDateString(value)
                                                                    ? formatDate(value)
                                                                    : String(value ?? "")}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        } else if (
                            parsed &&
                            typeof parsed === "object" &&
                            parsed !== null &&
                            !Array.isArray(parsed)
                        ) {
                            const entries = Object.entries(parsed as Record<string, unknown>);
                            return (
                                <div className="overflow-x-auto">
                                    <table className="min-w-[300px] border border-border rounded-xl shadow-sm bg-card text-card-foreground">
                                        <tbody>
                                            {entries.map(([key, value]) => (
                                                <tr key={key} className="hover:bg-muted/60 transition-colors">
                                                    <th className="px-4 py-2 bg-muted text-muted-foreground font-semibold text-left border-b border-border rounded-l-xl">
                                                        {key}
                                                    </th>
                                                    <td className="px-4 py-2 border-b border-border rounded-r-xl">
                                                        {typeof value === "string" && isDateString(value)
                                                            ? formatDate(value)
                                                            : String(value ?? "")}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        } else {
                            return (
                                <pre className="whitespace-pre-wrap font-sans text-left">
                                    {message.text}
                                </pre>
                            );
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}