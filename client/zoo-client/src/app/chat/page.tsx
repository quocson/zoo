'use client'
import { ChatProvider } from "./ChatContext";
import ChatComponent from "./ChatComponent";
const ChatPage = () => {
    return (
        <ChatProvider>
            <ChatComponent/>
        </ChatProvider>
    );
};

export default ChatPage;