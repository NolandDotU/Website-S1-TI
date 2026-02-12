import React from "react";
import { ChatInterface } from "./ChatInterface";

export function ChatModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
            <div className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-md h-full rounded-lg shadow-xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3>TI Asisten</h3>
                    <button onClick={onClose}>❌</button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ChatInterface isModal={true}/>
                </div>
            </div>
        </div>
    )
}