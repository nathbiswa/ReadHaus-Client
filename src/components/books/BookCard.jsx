"use client";

import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export default function BookCard({
    _id, // ডাইনামিক রাউটিং এর জন্য আইডি
    title,
    author,
    description,
    image,
    category,
    averageRating,
    totalReviews,
    deliveryFee,
    status
}) {
    // ডাটাবেজের "available" স্ট্যাটাস চেক করা হচ্ছে
    const isAvailable = status?.toLowerCase() === "available";

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col justify-between group hover:border-amber-400/50 transition-all duration-300">

            {/* ১. ইমেজ এবং স্ট্যাটাস ব্যাজ */}
            <div className="relative bg-gray-950 p-4 pt-6 flex items-center justify-center h-52 border-b border-gray-800/50">
                <img
                    src={image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                    alt={title}
                    className="max-h-44 object-contain rounded group-hover:scale-105 transition-transform duration-300"
                />

                <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isAvailable
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                    {isAvailable ? "Available" : "Checked Out"}
                </span>
            </div>

            {/* ২. কার্ড বডি কনটেন্ট */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    <span className="text-[11px] font-medium text-amber-400/80 bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">
                        {category}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-gray-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-400">By <span className="text-gray-300">{author}</span></p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* ৩. রেটিং এবং ডেলিভারি ফি */}
                <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.round(averageRating || 0) ? "fill-amber-400" : "text-gray-700"}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-gray-300">{averageRating || "0.0"}</span>
                        <span className="text-[10px] text-gray-500">({totalReviews || 0})</span>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Delivery</p>
                        <p className="text-sm font-bold text-emerald-400">${deliveryFee}</p>
                    </div>
                </div>

                {/* 🔗 ৪. ডাইনামিক ডিটেইলস পেজ লিংক বাটন */}
                <Link
                    href={`/book/${_id}`} // ক্লিক করলে সরাসরি ডিটেইলস পেজে নিয়ে যাবে
                    className="w-full mt-2 py-2 bg-gray-950 border border-gray-800 text-gray-200 text-xs font-semibold rounded hover:bg-amber-400 hover:text-gray-900 hover:border-amber-400 flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}