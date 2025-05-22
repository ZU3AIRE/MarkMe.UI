"use client";
import { Bot, Send, Trash, User } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

type MessageType = "user" | "bot";

interface Message {
    type: MessageType;
    text: string;
}

type ParsedData = Record<string, unknown> | { data: Record<string, unknown>[] } | unknown[] | null;

export default function Chatbot({ token }: { token: string }) {
    const [messages, setMessages] = useState<Message[]>([
        { type: "bot", text: "Hello! How can I assist you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setMessages((prev) => [...prev, { type: "user", text: input.trim() }]);
        const userQuery = input.trim();
        setInput("");

        try {
            const query = { Prompt: userQuery };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}Attendance/GetAttendanceByPrompt`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(query),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const formattedResponse = formatResponseData(data);
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", text: formattedResponse },
                ]);
            } else {
                throw new Error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                { type: "bot", text: "Error fetching data. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatResponseData = (data: unknown) => {
        try {
            if (typeof data === 'string') {
                return data;
            }

            return JSON.stringify(data, null, 2);
        } catch {
            return JSON.stringify(data);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            { type: "bot", text: "Hello! How can I assist you today?" },
        ]);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height =
                Math.min(inputRef.current.scrollHeight, 150) + "px";
        }
    }, [input]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, []);

    // Helper function to check if a value is a date string
    const isDateString = (value: unknown): boolean => {
        if (typeof value !== "string") return false;
        // Simple ISO date check (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
        return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?)?$/.test(value);
    };

    // Helper function to format date strings
    const formatDate = (value: string): string => {
        try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return format(date, "PPpp");
            }
            return value;
        } catch {
            return value;
        }
    };

    return (
        <div className="relative flex flex-col h-full w-full bg-gray-50 text-gray-800 overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white p-4 shadow-sm flex-shrink-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">AI Powered Attendance Reporting</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-1 rounded-md p-2 text-sm hover:bg-gray-100"
                            title="Clear conversation"
                        >
                            <Trash size={16} />
                            <span className="hidden sm:inline">Clear chat</span>
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-16 xl:px-32 pb-32"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-6 ${message.type === "user" ? "flex justify-end" : ""}`}
                    >
                        <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${message.type === "bot"
                                ? "bg-gray-700 text-white"
                                : "bg-blue-500 text-white"
                            }`}>
                                {message.type === "bot" ? <Bot size={16} /> : <User size={16} />}
                            </div>

                            <div className={`rounded-lg py-2 ${message.type === "user" ? "text-right" : ""} max-w-[75%]`}>
                                {(() => {
                                    let parsed: ParsedData;
                                    try {
                                        parsed = JSON.parse(message.text);
                                    } catch {
                                        parsed = null;
                                    }

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
                ))}

                {isLoading && (
                    <div className="mb-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white">
                                <Bot size={16} />
                            </div>
                            <div className="mt-2 flex space-x-1">
                                <div className="h-2 w-2 animate-bounce rounded-full delay-75"></div>
                                <div className="h-2 w-2 animate-bounce rounded-full delay-100"></div>
                                <div className="h-2 w-2 animate-bounce rounded-full delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t p-4 md:px-8 lg:px-16 xl:px-32 shadow-lg">
                <div className="mx-auto max-w-4xl rounded-lg border ">
                    <div className="relative flex items-end">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            placeholder="Message AI Assistant..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="max-h-32 min-h-10 w-full resize-none rounded-lg border-0 p-3 pr-12 text-sm focus:outline-none focus:ring-0"
                            style={{ overflowY: "auto" }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className={`absolute bottom-2 right-2 rounded-md p-1.5 ${isLoading || !input.trim()
                                    ? "text-gray-400"
                                    : "text-blue-500 hover:bg-blue-50"
                                }`}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <div className="border-t p-2 text-xs text-gray-500">
                        <span>Press Enter to send, Shift+Enter for new line</span>
                    </div>
                </div>
            </div>
        </div>
    );
}