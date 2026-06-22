'use client';
import { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const ViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // ব্যাকএন্ড API-এর URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchTransactions();
    }, []);

    // ব্যাকএন্ড থেকে সরাসরি ট্রানজেকশন ডেটা আনা
    const fetchTransactions = async () => {
        try {
            setLoading(true);

            // ✅ আপনার ব্যাকএন্ডের সঠিক ট্রানজেকশন এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো হলো
            const res = await fetch(`${API_URL}/api/admin/transactions`);

            if (!res.ok) {
                throw new Error("Failed to fetch data from server");
            }

            const result = await res.json();

            // ✅ ব্যাকএন্ড থেকে success: true এবং data আসলে তা স্টেটে সেট করা হচ্ছে
            if (result.success && result.data) {
                setTransactions(result.data);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error("Transaction fetch error:", error);
            toast.error("Failed to load real-time transactions!");
        } finally {
            setLoading(false);
        }
    };

    // স্ট্যাটাস অনুযায়ী ব্যাজ ডিজাইন করার হেল্পার ফাংশন
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'complete':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'pending':
                return 'bg-amber-50 text-amber-600 border border-amber-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    // 🔍 সার্চ এবং ফিল্টারিং লজিক (Client-side)
    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch =
            tx.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            tx.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    // মোট রেভিনিউ বা ইনকামের হিসাব
    const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            <Toaster position="top-right" />

            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Transactions Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        View all platform transactions. <span className="font-semibold text-indigo-600">({filteredTransactions.length} found)</span>
                    </p>
                </div>

                {/* Search & Utilities Filter */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search ID, User, or Book..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors shadow-sm"
                        />
                    </div>

                    {/* স্ট্যাটাস ফিল্টার ড্রপডাউন */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 shadow-sm outline-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="complete">Delivered / Complete</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <span className="text-xl font-bold">$</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">Filtered Volume</p>
                        <h3 className="text-xl font-bold text-slate-800">${totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* 🚀 ট্রানজেকশন হিস্ট্রি টেবিল */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction ID</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Librarian</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Book</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading transactions from database...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                                            <AlertCircle className="w-8 h-8 text-slate-300" />
                                            <span>No transactions matched your search criteria.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id || tx._id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                        <td className="p-4 font-mono font-semibold text-slate-700 text-xs tracking-tight">
                                            {tx.transactionId}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-sm">{tx.userName}</span>
                                                <span className="text-xs text-slate-400">{tx.userEmail}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700 text-sm">{tx.librarianName}</span>
                                                <span className="text-xs text-slate-400">{tx.librarianEmail}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-700 font-medium text-sm break-words max-w-[180px]">
                                            {tx.bookTitle}
                                        </td>
                                        <td className="p-4 text-emerald-700 font-bold text-sm">
                                            ${(Number(tx.amount) || 0).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">
                                            {tx.date}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${getStatusStyles(tx.status)}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewTransactions;