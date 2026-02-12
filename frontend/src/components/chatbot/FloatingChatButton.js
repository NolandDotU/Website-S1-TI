import React from "react";

export function FloatingChatButton({ onOpen, isOpen }) {
    if (isOpen) return null;

    return (
        <button onClick={onOpen}
        style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
        }}
        >💡</button>
    );
}