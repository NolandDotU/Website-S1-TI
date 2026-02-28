import React, { useRef, useEffect, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./MessageBubble";
import { InputArea } from "./InputArea";
import {
    getChatHistory,
    getOrCreateChatSessionId,
    getWelcomeMessage,
    streamChat,
} from "../../services/chatbot/chatAPI";
import { QuickAction } from "./QuickAction";
import { useToast } from "../../context/toastProvider";

export function ChatInterface({ isModal = false, theme }) {
    const messageEndRef = useRef(null);
    const [keyboardInset, setKeyboardInset] = useState(0);

    const [welcomeMessage, setWelcomeMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sessionId] = useState(() => getOrCreateChatSessionId());
    const toast = useToast();

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, loading]);

    useEffect(() => {
        async function loadWelcome() {
            try {
                const data = await getWelcomeMessage();
                setWelcomeMessage({
                    id: "welcome",
                    text: data.data.message,
                    sender: "ai",
                });
            } catch {
                setWelcomeMessage({
                    id: "welcome-fallback",
                    text: "Halo! 👋 Saya Mr. Wacana. ada yang bisa saya bantu?",
                    sender: "ai",
                });
            }
        } loadWelcome();
    }, []);

    useEffect(() => {
        let mounted = true;

        async function loadHistory() {
            try {
                const response = await getChatHistory(sessionId);
                const history = response?.data?.messages || [];
                const mapped = history.map((item, index) => ({
                    id: item._id || `history-${index}-${item.createdAt || Date.now()}`,
                    text: item.content,
                    sender: item.role === "assistant" ? "ai" : "user",
                }));

                if (mounted) {
                    setMessages(mapped);
                }
            } catch (error) {
                console.error ("Failed to create chat history: ", error);
                if (mounted) {
                    setMessages([]);
                    toast.error("Failed to load old message, please try again later.", {
                        duration: 4000,
                        position: 'top-center',
                    });
                }
            }
        }

        loadHistory();
        return () => {
            mounted = false;
        };
    }, [sessionId, toast]);

    useEffect(() => {
        if (!isModal) return;

        const updateKeyboardInset = () => {
            const isMobile = window.matchMedia("(max-width: 767px)").matches;
            if (!isMobile) {
                setKeyboardInset(0);
                return;
            }

            const vv = window.visualViewport;
            if (!vv) {
                setKeyboardInset(0);
                return;
            }

            const inset = Math.max(
                0,
                Math.round(window.innerHeight - vv.height - vv.offsetTop),
            );

            // Ignore tiny viewport movement from browser chrome animation.
            setKeyboardInset(inset > 80 ? inset : 0);
        };

        updateKeyboardInset();
        window.addEventListener("resize", updateKeyboardInset);
        window.visualViewport?.addEventListener("resize", updateKeyboardInset);
        window.visualViewport?.addEventListener("scroll", updateKeyboardInset);

        return () => {
            window.removeEventListener("resize", updateKeyboardInset);
            window.visualViewport?.removeEventListener("resize", updateKeyboardInset);
            window.visualViewport?.removeEventListener("scroll", updateKeyboardInset);
        };
    }, [isModal]);

    const handleSendMessage = (text) => {
        const userMsg = {
            id: "user-" + Date.now(),
            text,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMsg]);
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
                    if (index !== -1) {
                        const copy = [...prev];
                        copy[index] = aiMsg;
                        return copy;
                    }

                    return [...prev, aiMsg];
                });

                setLoading(false);
            },
            () => setLoading(false),
            (error) => {
                setLoading(false);
                toast.error(
                    error?.message || "Failed to get response from chatbot.",
                    {
                        duration: 4000,
                        position: "top-center",
                    }
                );
            }
        );
    };

    const displayMessages = welcomeMessage ? [welcomeMessage, ...messages] : messages;
    return (
        <div className={`flex flex-col ${isModal ? "h-full" : "h-screen"} overflow-hidden`}>
            <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth p-4 hide-scrollbar
                ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                {displayMessages.map((m) => (
                    <MessageBubble key={m.id} message={m} theme={theme} />
                ))}
                {messages.length === 0 && !loading && (
                    <QuickAction onSelect={handleSendMessage} theme={theme}/>
                )}
                {loading && <TypingIndicator />}

                <div ref={messageEndRef} />
            </div>
            <div
                style={{ bottom: keyboardInset }}
                className={`sticky bottom-0 z-10 pb-3 rounded-lg
                ${theme === "dark" ? "bg-gray-900" : "bg-blue-50"}`}>
                <InputArea onSendMessage={handleSendMessage} isLoading={loading} theme={theme} />
            </div>

        </div>
    );
}
