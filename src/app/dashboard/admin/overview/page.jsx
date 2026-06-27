"use client";

import React, { useState, useEffect } from "react";
import { Users, BookOpen, Truck, DollarSign } from "lucide-react";
import { Card, Spinner } from "@heroui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#ef4444"];

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // 🚀 স্ক্রিন সাইজ ট্র্যাক করার জন্য এবং SSR এরর এড়াতে ইফেক্ট
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🚀 লাইভ ডাটা ফেচ করার ইফেক্ট হুক
    useEffect(() => {
        async function fetchLiveStats() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/dashboard-stats`, {
                    cache: "no-store"
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Express API থেকে ডাটা ফেচ করতে সমস্যা হয়েছে:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLiveStats();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Spinner size="lg" color="indigo" label="MongoDB থেকে লাইভ ডাটা লোড হচ্ছে..." />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-slate-50/50 min-h-screen w-full max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">All live data and analytics on the platform.</p>
            </div>

            {/* 📊 ৪টি লাইভ ডাটা কার্ড (লার্জ ডিভাইসের জন্য ফিক্সড টেক্সট ভিউ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">

                {/* Total Users */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl w-full">
                    <Card.Content className="p-5 md:p-6 flex flex-row items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Users className="w-5 md:w-6" />
                        </div>
                        <div className="flex-1 min-w-fit">
                            <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Total Users</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-0.5 md:mt-1 block">
                                {stats?.totalUsers !== undefined ? stats.totalUsers : 0}
                            </h2>
                        </div>
                    </Card.Content>
                </Card>

                {/* Total Books */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl w-full">
                    <Card.Content className="p-5 md:p-6 flex flex-row items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 md:w-6" />
                        </div>
                        <div className="flex-1 min-w-fit">
                            <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Total Books</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-0.5 md:mt-1 block">
                                {stats?.totalBooks !== undefined ? stats.totalBooks : 0}
                            </h2>
                        </div>
                    </Card.Content>
                </Card>

                {/* Total Deliveries */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl w-full">
                    <Card.Content className="p-5 md:p-6 flex flex-row items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Truck className="w-5 md:w-6" />
                        </div>
                        <div className="flex-1 min-w-fit">
                            <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Total Deliveries</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-0.5 md:mt-1 block">
                                {stats?.totalDeliveries !== undefined ? stats.totalDeliveries : 0}
                            </h2>
                        </div>
                    </Card.Content>
                </Card>

                {/* Total Revenue */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl w-full">
                    <Card.Content className="p-5 md:p-6 flex flex-row items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                            <DollarSign className="w-5 md:w-6" />
                        </div>
                        <div className="flex-1 min-w-fit">
                            <p className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block whitespace-nowrap">Total Revenue</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-0.5 md:mt-1 block">
                                ${stats?.totalRevenue !== undefined ? stats.totalRevenue : "0.00"}
                            </h2>
                        </div>
                    </Card.Content>
                </Card>

            </div>

            {/* 📈 হাফ-পাই ক্যাটাগরি চার্ট সেকশন */}
            <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-4 md:p-6">
                <Card.Content>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 tracking-tight">Books by Category</h3>

                    <div className="w-full flex flex-col items-center gap-6">

                        {/* Recharts Container */}
                        <div className="w-full h-48 md:h-64 flex items-center justify-center relative overflow-hidden">
                            {stats?.chartData && stats.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.chartData}
                                            cx="50%"
                                            cy="100%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={isMobile ? 50 : 80}
                                            outerRadius={isMobile ? 110 : 160}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {stats.chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: "#1e293b", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                                            itemStyle={{ color: "#fff" }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-sm text-slate-400">No category data found.</p>
                            )}
                        </div>

                        {/* 🎨 ক্যাটাগরি লেজেন্ড */}
                        {stats?.chartData && stats.chartData.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-2xl w-full">
                                {stats.chartData.map((entry, index) => (
                                    <div
                                        key={`legend-${index}`}
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-100 bg-slate-50/50 text-[11px] md:text-xs font-semibold text-slate-600 shadow-sm"
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="whitespace-nowrap">{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </Card.Content>
            </Card>
        </div>
    );
}