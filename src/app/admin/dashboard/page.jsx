"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LayoutDashboard, Users, BookOpen, Truck, DollarSign } from "lucide-react";
import { CircleCheck } from "@gravity-ui/icons";
import { Card, Button, Spinner } from "@heroui/react"; // লোডিং এর জন্য Spinner ইম্পোর্ট করা হয়েছে
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { authClient } from "@/lib/auth-client"; // Better Auth-এর ক্লায়েন্ট সাইড সেশন রিডার

const COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#ef4444"];

export default function AdminDashboardPage() {
    // ডাইনামিক ডাটার জন্য স্টেটসমূহ
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Better Auth ক্লায়েন্ট থেকে ডাইনামিক সেশন ও ইউজার ডাটা নেওয়া
    const { data: session } = authClient.useSession();
    const user = session?.user;

    // ব্যাকএন্ড থেকে রিয়েল ডাটা ফেচ করা
    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    // ডাটা লোড হওয়ার সময় স্ক্রিনে একটি সুন্দর লোডিং স্পিনার দেখাবে
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <Spinner size="lg" color="indigo" label="Loading Realtime Data..." />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">

            {/* ─── SIDEBAR (বাম পাশের মেনু - সম্পূর্ণ ডাইনামিক) ─── */}
            <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col gap-8 shrink-0">

                {/* এডমিন প্রোফাইল এরিয়া (রিয়েল সেশন ডাটা) */}
                <div className="flex flex-col items-center text-center gap-2 border-b border-slate-50 pb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative">
                        <Image
                            src={user?.image || "/avatar-placeholder.png"} // ডাইনামিক প্রোফাইল পিকচার
                            alt="Admin Profile"
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{user?.name || "Admin"}</h3>
                        <p className="text-xs text-slate-400 font-medium">{user?.email || "admin@gmail.com"}</p>
                        <span className="mt-2 inline-block px-3 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                            {user?.role || "Admin"}
                        </span>
                    </div>
                </div>

                {/* নেভিগেশন লিংকসমূহ */}
                <nav className="flex flex-col gap-2">
                    <Button className="justify-start gap-3 px-4 py-6 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl" variant="light">
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" /> Overview
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <CircleCheck className="text-lg text-slate-400" /> Book Approvals
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <Users className="w-5 h-5 text-slate-400" /> Manage Users
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <BookOpen className="w-5 h-5 text-slate-400" /> Manage Books
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <DollarSign className="w-5 h-5 text-slate-400" /> Transactions
                    </Button>
                </nav>
            </aside>

            {/* ─── MAIN CONTENT AREA ─── */}
            <main className="flex-1 p-10 max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Platform-wide overview and analytics.</p>
                </div>

                {/* ─── STATS GRID (রিয়েল ডাটা থেকে কাউন্ট দেখাচ্ছে) ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

                    {/* কার্ড ১: Total Users */}
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

                    {/* কার্ড ২: Total Books */}
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

                    {/* কার্ড ৩: Total Deliveries */}
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

                    {/* কার্ড ৪: Total Revenue */}
                    <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl">
                        <Card.Content className="p-6 flex flex-row items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                                <h2 className="text-3xl font-bold text-slate-800 mt-1">${stats?.totalRevenue?.toFixed(2) || "0.00"}</h2>
                            </div>
                        </Card.Content>
                    </Card>

                </div>

                {/* ─── CHARTS SECTION (ক্যাটাগরি ডাটা ডাইনামিক ম্যাপ হচ্ছে) ─── */}
                <Card className="border-none bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-2xl p-4">
                    <Card.Content>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Books by Category</h3>

                        <div className="w-full h-64 flex items-center justify-center relative overflow-hidden">
                            {stats?.chartData && stats.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.chartData}
                                            cx="50%"
                                            cy="100%"
                                            startAngle={180}
                                            endAngle={0}
                                            innerRadius={60}
                                            outerRadius={140}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {stats.chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-sm text-slate-400">No category data available</p>
                            )}
                        </div>
                    </Card.Content>
                </Card>

            </main>
        </div>
    );
}