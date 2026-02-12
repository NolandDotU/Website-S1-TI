import React, { useState } from "react";

export function InputArea({ onSendMessage, isLoading }) {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim() || isLoading) return;
        onSendMessage(message.trim());
        setMessage("");
    };

    return (
        <div style={{ padding: "10px", borderTop: "1px solid #ddd"}}>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                style={{width: "100%" }}
                disabled={isLoading}
            />
            <button onClick={handleSubmit} disabled={isLoading}>
                Kirim
            </button>
        </div>
    )
}