import React from "react";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-slate-900/40 backdrop-blur-md">
            {/* 🎨 কালার ঘোরার মূল স্পিনার */}
            <div className="relative flex items-center justify-center">
                {/* রেনবো গ্রেডিয়েন্ট রিং */}
                <div className="h-16 w-16 animate-spin rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[4px]">
                    {/* মাঝখানের অংশ ফাঁপা করার জন্য ডার্ক মাস্ক */}
                    <div className="h-full w-full rounded-full bg-slate-900"></div>
                </div>

                {/* গ্লো বা লাইটিং ইফেক্ট দেওয়ার জন্য ব্যাকগ্রাউন্ড ব্লাড শ্যাডো */}
                <div className="absolute top-0 h-16 w-16 animate-pulse rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-50"></div>
            </div>
        </div>
    );
}