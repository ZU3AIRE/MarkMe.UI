import { Send } from "lucide-react";

export default function ChatInput({
    input,
    setInput,
    handleSend,
    handleKeyDown,
    inputRef,
    isLoading,
}: {
    input: string;
    setInput: (val: string) => void;
    handleSend: () => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    isLoading: boolean;
}) {
    return (
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
    );
}