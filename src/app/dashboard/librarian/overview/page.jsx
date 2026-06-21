'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { BookMarked, DollarSign, Clock, Layers } from "lucide-react";
// চার্টের জন্য Recharts ইমপোর্ট করা হলো
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const LibrarianOverview = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // ১. ব্যাকএন্ড থেকে ডাইনামিকালি লাইব্রেরিয়ানের সামারি ডেটা আনা
    useEffect(() => {
        const fetchLibrarianStats = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                const res = await fetch(`${baseUrl}/api/librarian-stats?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setStats(data.data);
                } else {
                    toast.error(data.message || "Failed to load overview data.");
                }
            } catch (error) {
                console.error("Librarian stats fetch error:", error);
                toast.error("Network error! Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchLibrarianStats();
    }, [user?.email]);

    // চার্টের কালার প্যালেট (মডার্ন গ্রেডিয়েন্ট ভাইব আনার জন্য)
    const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#10b981"];

    // ২. ডেটা লোড হওয়ার সময়ের কঙ্কাল (Skeleton UI)
    if (loading) {
        return (
            <div className="p-8 space-y-8 animate-pulse bg-slate-50/50 min-h-screen">
                <div className="space-y-2">
                    <div className="h-8 bg-slate-200 rounded-lg w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
            </div>
        );
    }

    // ব্যাকএন্ড থেকে চার্ট ডেটা না আসলে ডিফল্ট খালি অ্যারে বা ফলব্যাক প্রিপারেশন
    const chartData = stats?.categoryDistribution || [
        { name: "Romance", value: 50 },
        { name: "History", value: 50 }
    ];

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Librarian Overview</h1>
                <p className="text-slate-500 mt-1">Monitor your book collections, logistics, and analytics insights.</p>
            </div>

            {/* 🚀 স্ট্যাটস কার্ড গ্রিড (স্ক্রিনশটের চেয়ে সম্পূর্ণ ভিন্ন এবং আল্ট্রা-মডার্ন লেআউট) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* কার্ড ১: টোটাল বুকস */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Total Books Listed</span>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                            {stats?.totalBooks ?? 0}
                        </h2>
                    </div>
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <BookMarked className="w-6 h-6" />
                    </div>
                </div>

                {/* কার্ড ২: টোটাল আর্নিংস */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-100 transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Total Earnings</span>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                            ${Number(stats?.totalEarnings ?? 0).toFixed(2)}
                        </h2>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                {/* কার্ড ৩: পেন্ডিং রিকোয়েস্ট */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-100 transition-all duration-300">
                    <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Pending Requests</span>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
                            {stats?.pendingRequests ?? 0}
                        </h2>
                    </div>
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

            </div>

            {/* 🚀 চার্ট সেকশন: বুকস বাই ক্যাটাগরি (কার্ডের ভেতরে পজিশন করা) */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-3xl">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-6">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xl font-bold text-slate-800">Books by Category</h3>
                </div>

                {/* Recharts ডাইনামিক পাই চার্ট কন্টেইনার */}
                <div className="w-full h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70} // ডোনাট স্টাইল চার্ট লুক দেওয়ার জন্য
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default LibrarianOverview;