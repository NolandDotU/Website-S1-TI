import React, { useEffect, useRef, useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { X } from "lucide-react";

export function ChatModal({ isOpen, onClose, theme }) {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const modalRef = useRef(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const dragging = useRef(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
            setTimeout(() => setMounted(false), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!mounted) return;

        const scrollY = window.scrollY;
        const bodyStyle = document.body.style;
        const htmlStyle = document.documentElement.style;

        const prev = {
            bodyPosition: bodyStyle.position,
            bodyTop: bodyStyle.top,
            bodyLeft: bodyStyle.left,
            bodyRight: bodyStyle.right,
            bodyWidth: bodyStyle.width,
            bodyOverflow: bodyStyle.overflow,
            htmlOverflow: htmlStyle.overflow,
        };

        bodyStyle.position = "fixed";
        bodyStyle.top = `-${scrollY}px`;
        bodyStyle.left = "0";
        bodyStyle.right = "0";
        bodyStyle.width = "100%";
        bodyStyle.overflow = "hidden";
        htmlStyle.overflow = "hidden";

        return () => {
            bodyStyle.position = prev.bodyPosition;
            bodyStyle.top = prev.bodyTop;
            bodyStyle.left = prev.bodyLeft;
            bodyStyle.right = prev.bodyRight;
            bodyStyle.width = prev.bodyWidth;
            bodyStyle.overflow = prev.bodyOverflow;
            htmlStyle.overflow = prev.htmlOverflow;
            window.scrollTo(0, scrollY);
        };
    }, [mounted]);

    // if (!isOpen) return null;
    if (!mounted) return null;

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
        dragging.current = true;
    };

    const handleTouchMove = (e) => {
        if (!dragging.current) return;
        currentY.current = e.touches[0].clientY;

        const diff = currentY.current - startY.current;
        if (diff > 0 && modalRef.current) {
            modalRef.current.style.transform = `translateY(${diff}px)`;
        }
    };

    const handleTouchEnd = () => {
        dragging.current = false;

        const diff = currentY.current - startY.current;

        if (diff > 120) {
            onClose();
        } else if (modalRef.current) {
            modalRef.current.style.transform = `translateY(0px)`;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end md:p-4">
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm
            transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} onClick={onClose} />

            <div 
            ref={modalRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-screen h-[100dvh] md:w-full md:max-w-md md:h-[80vh]
            md:rounded-2xl shadow-2xl flex flex-col
            transform transition-all duration-300 ease-out
            ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"}
            ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                <div className="flex justify-center pt-2 md:hidden">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>
                <div className={`flex justify-between items-center px-5 py-4 border-b  
                    md:rounded-t-2xl
                    ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"}`}>
                    <h3 className="font-semibold text-lg">Asisten TI</h3>
                    <button onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:rotate-90 active:scale-90">
                        <X size={19}/>
                    </button>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <ChatInterface isModal={true} theme={theme}/>
                </div>
            </div>
        </div>
    );
}
