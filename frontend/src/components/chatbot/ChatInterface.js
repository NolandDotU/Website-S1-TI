import React, {useRef, useEffect, useState} from "react";
import {MessageBubble} from "./MessageBubble";
import { TypingIndicator } from "./MessageBubble";
import {InputArea} from "./InputArea";
import {getWelcomeMessage, streamChat} from "../../services/chatbot/chatAPI";

export function ChatInterface({ isModal = false }) {
    const messageEndRef = useRef(null);

    const [welcomeMessage, setWelcomeMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sessionId = "default";

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, loading]);

    useEffect(() => {
        async function loadWelcome(){
            try {
                const data = await getWelcomeMessage();
                setWelcomeMessage({
                    id: "welcome",
                    text: data.data.message,
                    sender: "ai",
                });
            }catch {
                setWelcomeMessage({
                    id: "welcome-fallback",
                    text: "Halo! 👋 Saya Mr. Wacana. ada yang bisa saya bantu?",
                    sender: "ai",
                });
            }
        } loadWelcome();
    }, []);

    const handleSendMessage = (text) => {
        const userMsg = {
            id: "user-" + Date.now(),
            text,
            sender: "user",
        };

        setMessages((prev) => [...prev,userMsg]);
        setLoading(true);

        let accum = "";
        const aiId = "ai-" + Date.now();

        streamChat(
            text,
            sessionId,
            (chunk) => {
                accum += chunk;

                setMessages((prev) => {
                    const index = prev.findIndex((m) => m.id === aiId);
                    const aiMsg = {
                        id: aiId,
                        text: accum,
                        sender: "ai",
                    };
                    if (index !== -1){
                        const copy = [...prev];
                        copy[index] = aiMsg;
                        return copy;
                    }

                    return [...prev, aiMsg];
                });

                setLoading(false);
            }, () => setLoading(false), () => setLoading(false)
        );
    };

    const displayMessages = welcomeMessage ? [welcomeMessage, ...messages] : messages;
    return (
        <div className={`flex flex-col ${isModal ? "h-full" : "h-screen"}`}>
            <div className="flex-1 overflow-y-auto p-4">
                {displayMessages.map((m) => (
                    <MessageBubble key={m.id} message={m}/>
                ))}
                {loading && <TypingIndicator/>}

                <div ref={messageEndRef}/>
            </div>

            <InputArea onSendMessage={handleSendMessage} isLoading={loading}/>
        </div>
    );
}