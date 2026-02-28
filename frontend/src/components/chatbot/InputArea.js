import { SendHorizonalIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export function InputArea({ onSendMessage, isLoading, theme }) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "0px";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, [message]);

    const handleSubmit = () => {
        if (!message.trim() || isLoading) return;
        onSendMessage(message.trim());
        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div
            className={`px-2 md:px-3 pt-2 pb-[max(env(safe-area-inset-bottom),8px)]
            ${theme === "dark" ? "bg-gray-900" : "bg-blue-50"}`}>
            <div
                className={`flex items-end gap-2 rounded-3xl px-2 py-2 shadow-sm border
                ${theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-blue-100"
                }`}>
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isLoading}
                    className={`resize-none flex-1 rounded-2xl focus:outline-none px-3 py-3 border-0 leading-5 max-h-[120px]
                    ${theme === "dark" ? "bg-gray-800 text-white placeholder-gray-400 disabled:opacity-50"
                        : "bg-white text-gray-900 placeholder-gray-500 disabled:opacity-50"
                    }`}
                    placeholder="Ketik Pesan..."
                />
                <button onClick={handleSubmit} disabled={isLoading}
                    className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0">
                    <SendHorizonalIcon size={20} />
                </button>
            </div>
        </div>
    )
}
