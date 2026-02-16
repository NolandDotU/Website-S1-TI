import { SendHorizonalIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export function InputArea({ onSendMessage, isLoading, theme }) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

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
        <div className={`p-3 pb-[env(safe-area-inset-bottom)]
        ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}>
            <div className="flex items-end gap-2">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isLoading}
                    className={`resize-none flex-1 rounded-lg focus:outline-none px-3 py-2 focus:ring-2 border
                    ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 disabled:opacity-50"
                        : "bg-white border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                    }`}
                    placeholder="Ketik Pesan..."
                />
                <button onClick={handleSubmit} disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <SendHorizonalIcon size={25} />
                </button>
            </div>
        </div>
    )
}