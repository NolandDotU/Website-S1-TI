import React from "react";
import { Megaphone, User, Info } from "lucide-react";

const action = [
    {
        label: "Tanya Pengumuman",
        message: "ada pengumuman terbaru?",
        icon: Megaphone
    },
    {
        label: "Info Dosen",
        message: "Saya ingin informasi dosen",
        icon: User
    },
    {
        label: "Informasi Umum",
        message: "Saya butuh informasi umum",
        icon: Info
    }
];

export function QuickAction({ onSelect, theme }) {
    return (
        <div className="p-4 space-y-2 animate-fadeIn">
            <p className="text-sm text-gray-500 mb-2">
                Pilih Pertanyaan Cepat:
            </p>

            {action.map((item, i) => {
                const Icon = item.icon;
                return (
                    <button key={i} onClick={() => onSelect(item.message)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl  
                    transition-all duration-200 hover:scale-[1.02]
                    active:scale-95
                    ${theme === "dark"
                                ? "text-gray-100 bg-gray-800 hover:bg-gray-700 hover:border-blue-300 border border-gray-500"
                                : "bg-gray-50 border-gray-200 hover:bg-blue-50  hover:border-blue-300 border text-gray-700"}`}>
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <Icon size={18} />
                        </div>
                        <span className="text-sm font-medium">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}