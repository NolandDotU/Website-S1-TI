import React, {useRef, useEffect, useState} from "react";
import {MessageBubble} from "./MessageBubble";
import {InputArea} from "./InputArea";
import {getWelcomeMessage, streamChat} from "../../services/chatbot/chatAPI";

export function ChatInterface({ isModal = false }) {
    const messageEndRef = useRef(null);

    const [welcomeMessage, setWelcomeMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sessionId = "default";

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        async function loadWelcome(){
            try {
                const data = await getWelcomeMessage();
                setWelcomeMessage({
                    id: "welcome",
                    text: data.data.message,
                    sender: "ai",
                    timestamp: new Date(),
                    source: "system",
                });
            }catch {
                setWelcomeMessage({
                    id: "welcome-fallback",
                    text: "Halo! 👋 Saya Mr. Wacana. ada yang bisa saya bantu?",
                    sender: "ai",
                    timestamp: new Date(),
                });
            }
        } loadWelcome();
    }, []);

    const handleSendMessage = (text) => {
        const userMsg = {
            id: "user-" + Date.now(),
            text,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev,userMsg]);
        setLoading(true);

        let accum = "";
        let firstChunk = true;

        streamChat(
            text,
            sessionId,
            (chunk) => {
                if (firstChunk) {
                    setLoading(false);
                    firstChunk = false;
                }

                accum += chunk;

                const aiMsg = {
                    id: "ai-" + Date.now(),
                    text: accum,
                    sender: "ai",
                    timestamp: new Date(),
                    source: "rag",
                };

                setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.sender === "ai") {
                        return [...prev.slice(0, -1), aiMsg];
                    }
                    return [...prev, aiMsg];
                });
            },
            () => setLoading(false),
            () => setLoading(false)
        );
    };

    const displayMessages = welcomeMessage ? [welcomeMessage, ...messages] : messages;
    return (
        <div className={`flex flex-col ${isModal ? "h-full" : "h-screen"}`}>
            <div className="flex-1 overflow-y-auto p-4">
                {displayMessages.map((m) => (
                    <MessageBubble key={m.id} message={m}/>
                ))}
                {loading && <div> AI sedang mengetik...</div>}
                <div ref={messageEndRef} />
            </div>

            <InputArea
            onSendMessage={handleSendMessage}
            isLoading={loading}
            />
        </div>
    )
}