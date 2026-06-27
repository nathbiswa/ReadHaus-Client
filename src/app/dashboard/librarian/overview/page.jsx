"use client";

import React, { useState, useEffect } from "react";
import { BookMarked, DollarSign, Clock, Layers, Star } from "lucide-react";
import { Card, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

// Next.js Hydration error এড়াতে Recharts ডাইনামিক ইমপোর্ট করা হলো
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

const COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#ef4444"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LibrarianOverview() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🚀 লাইভ ডাটা ফেচ করার ইফেক্ট হুক
    useEffect(() => {
        async function fetchLibrarianStats() {
            if (sessionLoading || !session?.user?.email) return;

            try {
                const timestamp = new Date().getTime();
                const res = await fetch(
                    `${API_URL}/api/librarian-stats?email=${session.user.email}&_t=${timestamp}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setStats(data.data);
                    } else {
                        toast.error(data.message || "Failed to load overview data.");
                    }
                }
            } catch (error) {
                console.error("Librarian stats fetch error:", error);
                toast.error("Network error! Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        }

        fetchLibrarianStats();
    }, [session?.user?.email, sessionLoading]);

    // 🛠️ ইয়ার্নিং ফরম্যাটার ফাংশন (টাকা এবং ডলার দুইটাই হ্যান্ডেল করবে নিরাপদে)
    const formatEarnings = (value) => {
        if (value === undefined || value === null) return "৳0.00";

        // স্ট্রিং বা অন্য ফরম্যাটে আসলে সংখ্যায় রূপান্তর করে নেওয়া হচ্ছে
        const numericValue = Number(value);
        if (isNaN(numericValue)) return `৳${value}`;

        // বিডিটি (BDT/৳) ফরম্যাটে দেখানোর জন্য
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2
        }).format(numericValue);
    };

    // ডাটা বা সেশন লোড হওয়ার সময় স্পিনার দেখাবে
    if (loading || sessionLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-slate-500 text-sm font-medium">Librarian লাইভ ডাটা লোড হচ্ছে...</span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">Librarian Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Monitor your book collections, logistics, and analytics insights in real-time.</p>
            </div>

            {/* 📊 ৩টি লাইভ ডাটা কার্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                {/* Total Books Listed */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <div className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                            <BookMarked className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Books Listed</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">
                                {stats?.totalBooksListed ?? 0}
                            </h2>
                        </div>
                    </div>
                </Card>

                {/* Total Earnings - NOW FIXED 🟢 */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <div className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Earnings</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">
                                {formatEarnings(stats?.totalEarnings)}
                            </h2>
                        </div>
                    </div>
                </Card>

                {/* Active Pending Requests */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <div className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Pending Requests</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">
                                {stats?.activePendingRequests ?? 0}
                            </h2>
                        </div>
                    </div>
                </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 📈 হাফ-পাই ক্যাটাগরি চার্ট সেকশন */}
                <div className="lg:col-span-1">
                    <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-6 h-full">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                                <Layers className="w-5 h-5 text-indigo-500" />
                                Books by Category
                            </h3>
                            <div className="w-full h-64 flex items-center justify-center relative overflow-hidden">
                                {stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.categoryDistribution}
                                                cx="50%"
                                                cy="100%"
                                                startAngle={180}
                                                endAngle={0}
                                                innerRadius={60}
                                                outerRadius={110}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {stats.categoryDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-sm text-slate-400">No category data found.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 📋 Most Requested Books (Mini-List) সেকশন */}
                <div className="lg:col-span-2">
                    <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-6 h-full">
                        <div className="flex flex-col h-full">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                Most Requested Books (Mini-List)
                            </h3>

                            <div className="overflow-x-auto rounded-xl border border-slate-100 flex-grow">
                                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                                        <tr>
                                            <th className="p-4">Book Title</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4 text-center">Total Requests</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {stats?.mostRequestedBooks && stats.mostRequestedBooks.length > 0 ? (
                                            stats.mostRequestedBooks.map((book, idx) => (
                                                <tr key={book._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="p-4 font-medium text-slate-800 truncate max-w-[220px]">
                                                        {book.title || "Untitled"}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                            {book.category || "General"}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center font-bold text-indigo-600">
                                                        {book.requestCount ?? 0} times
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="p-8 text-center text-slate-400 text-sm">
                                                    No requested books data available yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}