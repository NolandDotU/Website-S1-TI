import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MessageBubble({ message }) {
    const isUser = message.sender === "user";

    return (
        <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm transition-all duration-300 animate-fadeUp
            ${isUser ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export function TypingIndicator(){
    return (
        <div className="flex justify-start mb-3">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                </div>
            </div>
        </div>
    );
}