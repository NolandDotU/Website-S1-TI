import React, { useState } from "react";

export function InputArea({ onSendMessage, isLoading }) {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim() || isLoading) return;
        onSendMessage(message.trim());
        setMessage("");
    };

    return (
        <div className="p-3 border-t border-gray-300 bg-white rounded-lg">
            <div className="flex items-end gap-2">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={1}
                    disabled={isLoading}
                    className="resize-none flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="Ketik Pesan..."
                />
                <button onClick={handleSubmit} disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    Kirim
                </button>
            </div>
        </div>
    )
}