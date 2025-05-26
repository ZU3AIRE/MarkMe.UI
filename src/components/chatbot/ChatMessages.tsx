import ChatMessage from "@/components/chatbot/ChatMessage";
import { Bot } from "lucide-react";
import type { Message } from "./chat-bot";

export default function ChatMessages({
    messages,
    isLoading,
    chatContainerRef,
}: {
    messages: Message[];
    isLoading: boolean;
    chatContainerRef: React.RefObject<HTMLDivElement>;
}) {
    return (
        <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-16 xl:px-32 pb-32"
        >
            {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
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
    );
}