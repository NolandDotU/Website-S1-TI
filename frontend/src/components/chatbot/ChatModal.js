import React, { useEffect, useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { X } from "lucide-react";

export function ChatModal({ isOpen, onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm
            transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} onClick={onClose} />

            <div className={`relative bg-white w-full max-w-md h-[80vh]
            rounded-2xl shadow-2xl flex flex-col
            transform transition-all duration-300 ease-out
            ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"}`}>
                <div className="flex justify-between items-center px-5 py-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
                    <h3 className="font-semibold text-lg">Asisten TI</h3>
                    <button onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-90 active:scale-90">
                        <X size={19}/>
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ChatInterface isModal={true}/>
                </div>
            </div>
        </div>
    );
}