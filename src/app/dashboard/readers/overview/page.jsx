'use client';
import { useEffect, useState } from "react";
import { BookOpen, Truck, DollarSign, Activity } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const Overview = ({ user }) => {

    const [summary, setSummary] = useState({ booksRead: 0, pendingDeliveries: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            // 🚀 ইউজার বা ইউজারের ইমেইল না আসা পর্যন্ত এপিআই কল করবে না
            if (!user?.email) {
                return;
            }

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

                const res = await fetch(`${baseUrl}/api/user-summary?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setSummary(data.data);
                } else {
                    toast.error(data.message || "Failed to load activity summary.");
                }
            } catch (error) {
                console.error("Summary metric fetch error:", error);
                toast.error("Network error! Could not load analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardSummary();
    }, [user?.email]); // 👈 শুধুমাত্র ইমেইল পরিবর্তন হলে বা লোড হলে ফায়ার হবে

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            <Toaster position="top-right" />

            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back, {user?.name || "Reader"}!
                </h1>
                <p className="text-slate-500 mt-1">Here's your reading overview and platform statistics.</p>
            </div>

            {/* Metrics Cards Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Card 1: Books Read */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Books Read</p>
                        {/* 🚀 লোডিং থাকলে স্পিনার দেখাবে, ডেটা আসলে সংখ্যা দেখাবে */}
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                            {loading && !user?.email ? (
                                <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : summary.booksRead}
                        </h3>
                    </div>
                </div>

                {/* Card 2: Pending Deliveries */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Deliveries</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                            {loading && !user?.email ? (
                                <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : summary.pendingDeliveries}
                        </h3>
                    </div>
                </div>

                {/* Card 3: Total Spent */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                            {loading && !user?.email ? (
                                <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                `$${Number(summary.totalSpent || 0).toFixed(2)}`
                            )}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Monthly Activity Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Monthly Reading Activity
                </h2>
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                    No reading activity yet. Start requesting book deliveries!
                </div>
            </div>
        </div>
    );
};

export default Overview;