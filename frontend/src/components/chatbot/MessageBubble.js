import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

export function MessageBubble ({message}) {
    const isUser = message.sender === "user";

    return (
        <div style={{ textAlign: isUser ? "right" : "left", marginBottom: 10}}>
            <div style={{
                display: "inline-block",
                padding: 10,
                borderRadius: 12,
                background: isUser ? "#d1e7ff" : "#f1f1f1",
                maxWidth: "70%",
            }}
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                </ReactMarkdown>
            </div>
        </div>
    );
}