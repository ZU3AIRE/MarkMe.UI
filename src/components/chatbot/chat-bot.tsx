"use client";
import ChatHeader from "@/components/chatbot/ChatHeader";
import ChatInput from "@/components/chatbot/ChatInput";
import ChatMessages from "@/components/chatbot/ChatMessages";

import { useRef, useState, useEffect } from "react";

type MessageType = "user" | "bot";

export interface Message {
    type: MessageType;
    text: string;
}

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

    return (
        <div className="relative flex flex-col h-full w-full bg-gray-50 text-gray-800 overflow-hidden">
            <ChatHeader onClear={clearChat} />
            <ChatMessages
                messages={messages}
                isLoading={isLoading}
                chatContainerRef={chatContainerRef}
            />
            <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleKeyDown={handleKeyDown}
                inputRef={inputRef}
                isLoading={isLoading}
            />
        </div>
    );
}