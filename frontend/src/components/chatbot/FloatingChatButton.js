import React from "react";
import { MessageCircle } from "lucide-react";

export function FloatingChatButton({ onOpen, isOpen }) {
    if (isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 group z-50">
            <div className="
          absolute bottom-full mb-2 right-0
          bg-gray-900 text-white text-sm
          px-3 py-1 rounded-lg
          opacity-0 group-hover:opacity-100
          transition duration-200
          whitespace-nowrap
          pointer-events-none">
                Chat dengan kami
                <div className="
          absolute top-full right-6
          w-0 h-0
          border-l-4 border-r-4 border-t-4
          border-l-transparent border-r-transparent border-t-gray-900"/>
            </div>
            <button
                onClick={onOpen}
                className="
          w-14 h-14
          rounded-full
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white
          flex items-center justify-center
          shadow-2xl
          hover:scale-110 hover:shadow-blue-400/50
          transition-all duration-300">
                <MessageCircle size={26} />
            </button>
        </div>
    );
}
