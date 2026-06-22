'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { BookMarked, DollarSign, Clock, Layers } from "lucide-react";
import dynamic from 'next/dynamic';

// Recharts এর জন্য Hydration এড়াতে ডাইনামিক ইমপোর্ট
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LibrarianOverview = () => {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // ১. ব্যাকএন্ড থেকে ডেটা আনা
    useEffect(() => {
        const fetchLibrarianStats = async () => {
            if (sessionLoading || !session?.user?.email) return;

            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/librarian-stats?email=${session.user.email}`);
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
    }, [session?.user?.email, sessionLoading]);

    const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#10b981"];
    const chartData = stats?.categoryDistribution || [];

    // ২. লোডিং স্টেট (Skeleton UI)
    if (loading || sessionLoading) {
        return (
            <div className="p-8 space-y-8 animate-pulse bg-slate-50/50 min-h-screen">
                <div className="h-8 bg-slate-200 rounded-lg w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Librarian Overview</h1>
                <p className="text-slate-500 mt-1">Monitor your book collections, logistics, and analytics insights.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-sm font-semibold text-slate-400 uppercase">Total Books</span>
                        <h2 className="text-4xl font-black text-slate-800">{stats?.totalBooks ?? 0}</h2>
                    </div>
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><BookMarked className="w-6 h-6" /></div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-sm font-semibold text-slate-400 uppercase">Total Earnings</span>
                        <h2 className="text-4xl font-black text-slate-800">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats?.totalEarnings ?? 0)}
                        </h2>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-sm font-semibold text-slate-400 uppercase">Pending Requests</span>
                        <h2 className="text-4xl font-black text-slate-800">{stats?.pendingRequests ?? 0}</h2>
                    </div>
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-3xl">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-6">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xl font-bold text-slate-800">Books by Category</h3>
                </div>

                <div className="w-full h-[300px]">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">No category data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LibrarianOverview;