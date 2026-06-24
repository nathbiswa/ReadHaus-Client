'use client';
import { useEffect, useState } from "react";
import { BookOpen, Truck, DollarSign, Activity } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// 🚀 Chart.js কোর এবং রিয়্যাক্ট কম্পোনেন্ট ইম্পোর্ট
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// 🚀 Chart.js মডিউলগুলো রেজিস্টার করা আবশ্যক
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Overview = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [summary, setSummary] = useState({ booksRead: 0, pendingDeliveries: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            if (!user?.email) return;

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
    }, [user?.email]);

    // 📊 Chart.js কনফিগারেশন এবং প্রিমিয়াম ডেটাসেট
    const chartData = {
        labels: ['Books Read', 'Pending Orders', 'Total Expense'],
        datasets: [
            {
                label: 'Activity Metrics',
                // এক্স অক্ষ বরাবর যথাক্রমে আপনার ডেটা পপুলেট হবে
                data: [summary.booksRead, summary.pendingDeliveries, summary.totalSpent],
                fill: true, // এরিয়া ফিল ট্রু করা হলো গ্রেডিয়েন্টের জন্য
                borderColor: 'rgb(99, 102, 241)', // Indigo কালার লাইন
                // 🎨 প্রো-লেভেল নিয়ন গ্রেডিয়েন্ট ইফেক্ট
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
                    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
                    return gradient;
                },
                tension: 0.4, // লাইনটিকে সুন্দর কার্ভ (Curve) করবে
                pointBackgroundColor: 'rgb(255, 255, 255)',
                pointBorderColor: 'rgb(99, 102, 241)',
                pointBorderWidth: 3,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgb(99, 102, 241)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                pointRadius: 5,
            }
        ]
    };

    // ⚙️ Chart.js কাস্টম গ্লোবাল অপশনস (ড্যাশবোর্ড ম্যাচিং থিম)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // ক্লিন লুকের জন্য ডিফল্ট লেজেন্ড হাইড করা হয়েছে
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#94a3b8',
                bodyColor: '#fff',
                bodyFont: { size: 14, weight: 'bold' },
                padding: 12,
                cornerRadius: 12,
                borderColor: '#334155',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    // ৩ নম্বর ডাটা অর্থাৎ Total Spent এর ক্ষেত্রে $ সাইন দেখানোর জন্য কন্ডিশন
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (context.dataIndex === 2) {
                            return ` $${Number(context.parsed.y).toFixed(2)}`;
                        }
                        return ` Count: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 12, weight: '500' } }
            },
            y: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#94a3b8', font: { size: 12 } }
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-slate-950 min-h-screen text-slate-100 antialiased selection:bg-indigo-500/30">
            <Toaster position="top-right" />

            {/* Top Bar - Premium Header */}
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                        Welcome back, {user?.name || "Reader"}!
                    </h1>
                    <p className="text-slate-400 text-sm mt-1.5">Monitor your platform engagement and financial telemetry.</p>
                </div>
                <div className="text-xs font-semibold tracking-wider uppercase px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400">
                    Live Feed Active
                </div>
            </div>

            {/* Metrics Cards Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">

                {/* Card 1: Books Read */}
                <div className="relative group bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-2xl transition-all duration-300 hover:border-slate-700">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl transition-all duration-300 group-hover:bg-indigo-500/20" />
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Books Read</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {loading && !user?.email ? (
                                    <span className="inline-block w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                                ) : summary.booksRead}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card 2: Pending Deliveries */}
                <div className="relative group bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-2xl transition-all duration-300 hover:border-slate-700">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transition-all duration-300 group-hover:bg-amber-500/20" />
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Pending Shipments</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {loading && !user?.email ? (
                                    <span className="inline-block w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                                ) : summary.pendingDeliveries}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card 3: Total Spent */}
                <div className="relative group bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-2xl sm:col-span-2 md:col-span-1 transition-all duration-300 hover:border-slate-700">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl transition-all duration-300 group-hover:bg-emerald-500/20" />
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Total Capital Spent</p>
                            <h3 className="text-3xl font-bold text-emerald-400 mt-1">
                                {loading && !user?.email ? (
                                    <span className="inline-block w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    `$${Number(summary.totalSpent || 0).toFixed(2)}`
                                )}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 High-End Chart.js Analytics Section */}
            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-2xl shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Dynamic Activity Vector</h2>
                            <p className="text-xs text-slate-500">Holistic overview mapping platform interaction and investments.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-3 rounded-xl border border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-400">Total Investment: ${Number(summary.totalSpent || 0).toFixed(2)}</span>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="w-full h-80 sm:h-[400px]">
                    {summary.booksRead > 0 || summary.pendingDeliveries > 0 || summary.totalSpent > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40 p-6">
                            <div className="p-3 bg-slate-900 rounded-full text-slate-600 mb-2">
                                <Activity className="w-6 h-6" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">No system metrics available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;