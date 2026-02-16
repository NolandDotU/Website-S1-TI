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

export function QuickAction({ onSelect }) {
    return (
        <div className="p-4 space-y-2 animate-fadeIn">
            <p className="text-sm text-gray-500 mb-2">
                Pilih Pertanyaan Cepat:
            </p>

            {action.map((item, i) => {
                const Icon = item.icon;
                return (
                    <button key={i} onClick={() => onSelect(item.message)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:scale-[1.02] active:scale-95">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <Icon size={18}/>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}