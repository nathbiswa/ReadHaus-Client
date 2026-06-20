"use client";

import React, { useState, useEffect } from "react";
import { Users, BookOpen, Truck, DollarSign } from "lucide-react";
import { Card, Spinner } from "@heroui/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#ef4444"];

export default function OverviewPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🚀 এই useEffect এর ভেতরেই ব্যাকএন্ডের ডাটা কল করা হয়েছে
    useEffect(() => {
        async function fetchLiveStats() {
            try {
                const res = await fetch("http://localhost:5000/api/admin/dashboard-stats");

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Express API থেকে ডাটা ফেচ করতে সমস্যা হয়েছে:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLiveStats();
    }, []);

    // ডাটা লোড হওয়ার সময় স্পিনার দেখাবে
    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Spinner size="lg" color="indigo" label="MongoDB থেকে লাইভ ডাটা লোড হচ্ছে..." />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">প্ল্যাটফর্মের সব লাইভ ডাটা ও অ্যানালিটিক্স।</p>
            </div>

            {/* 📊 ৪টি লাইভ ডাটা কার্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

                {/* Total Users */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <Card.Content className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{stats?.totalUsers || 0}</h2>
                        </div>
                    </Card.Content>
                </Card>

                {/* Total Books */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <Card.Content className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Books</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{stats?.totalBooks || 0}</h2>
                        </div>
                    </Card.Content>
                </Card>

                {/* Total Deliveries */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <Card.Content className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Deliveries</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">{stats?.totalDeliveries || 0}</h2>
                        </div>
                    </Card.Content>
                </Card>

                {/* Total Revenue */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                    <Card.Content className="p-6 flex flex-row items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                            <h2 className="text-3xl font-bold text-slate-800 mt-1">${stats?.totalRevenue || "0.00"}</h2>
                        </div>
                    </Card.Content>
                </Card>

            </div>

            {/* 📈 হাফ-পাই ক্যাটাগরি চার্ট সেকশন */}
            <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-4">
                <Card.Content>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Books by Category</h3>
                    <div className="w-full h-64 flex items-center justify-center relative overflow-hidden">
                        {stats?.chartData && stats.chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.chartData}
                                        cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={140} paddingAngle={2} dataKey="value"
                                    >
                                        {stats.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-slate-400">কোনো ক্যাটাগরি ডাটা পাওয়া যায়নি</p>
                        )}
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
}