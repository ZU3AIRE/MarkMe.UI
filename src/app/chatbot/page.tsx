import Chatbot from "@/components/chatbot/chat-bot";
import { auth } from "@clerk/nextjs/server";

export default async function ChatbotPage() {
    const { getToken } = await auth();
    const token = await getToken({ template: 'mark_me_backend_api' });
    if (token === null) return null;

    return (
        <Chatbot token={token} ></Chatbot>
    );
}
