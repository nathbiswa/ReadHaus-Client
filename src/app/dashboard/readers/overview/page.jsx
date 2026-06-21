'use client';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Overview = ({ user }) => {
    // ✅ ডিফল্ট স্টেট স্ট্রাকচার ঠিক রাখা হয়েছে
    const [summary, setSummary] = useState({ booksRead: 0, pendingDeliveries: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            // 1. যদি ইমেইল না থাকে, লোডিং ফলস করে এখানেই রিটার্ন করুন
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    }, [user?.email]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-medium">
                Loading your summary metrics...
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name || "Derek"}!</h1>
                <p className="text-gray-500 mt-1">Here's your reading overview.</p>
            </div>

            {/* Metrics Cards Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Books Read */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <span className="text-xl font-bold">📖</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Books Read</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{summary.booksRead}</h3>
                    </div>
                </div>

                {/* Card 2: Pending Deliveries */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
                        <span className="text-xl font-bold">🚚</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{summary.pendingDeliveries}</h3>
                    </div>
                </div>

                {/* Card 3: Total Spent */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <span className="text-xl font-bold">💵</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Spent</p>
                        {/* ✅ তো ফরম্যাটিং নিশ্চিত করতে Number.toFixed(2) সেফগার্ড দেওয়া হয়েছে */}
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                            ${Number(summary.totalSpent || 0).toFixed(2)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Monthly Activity Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Reading Activity</h2>
                <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl">
                    No reading activity yet. Start requesting book deliveries!
                </div>
            </div>
        </div>
    );
};

export default Overview;