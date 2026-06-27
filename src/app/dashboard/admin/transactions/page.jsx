'use client';
import { useState, useEffect } from "react";
import { Search, AlertCircle, Calendar, DollarSign, BookOpen, User, UserCheck, Hash } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const ViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/admin/transactions`);

            if (!res.ok) {
                throw new Error("Failed to fetch data from server");
            }

            const result = await res.json();

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

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'complete':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-600 border border-amber-200';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

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

    const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    return (
        <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen w-full max-w-7xl mx-auto">
            <Toaster position="top-right" />

            {/* Header + Filters Container */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Transactions Management
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5">
                        View all platform transactions. <span className="font-semibold text-indigo-600">({filteredTransactions.length} found)</span>
                    </p>
                </div>

                {/* Filters Input Grid */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search ID, User, or Book..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 md:py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full transition-colors shadow-sm"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 md:py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 shadow-sm outline-none cursor-pointer w-full sm:w-auto"
                    >
                        <option value="all">All Status</option>
                        <option value="complete">Delivered / Complete</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Total Filtered Volume Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">
                        $
                    </div>
                    <div>
                        <p className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Filtered Volume</p>
                        <h3 className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">${totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Trigger */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-sm font-medium">Loading transactions from database...</span>
                </div>
            ) : filteredTransactions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span className="text-sm font-medium">No transactions matched your search criteria.</span>
                </div>
            ) : (
                <>
                    {/* ==================== ১. মোবাইল ও ট্যাবলেট ভিউ (Responsive Cards) ==================== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {filteredTransactions.map((tx) => (
                            <div key={tx.id || tx._id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="font-mono font-bold text-xs bg-slate-50 text-slate-500 border border-slate-100 px-2 py-1 rounded-lg flex items-center gap-1">
                                        <Hash size={12} /> {tx.transactionId}
                                    </span>
                                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full uppercase tracking-wide shrink-0 ${getStatusStyles(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </div>

                                <div className="space-y-2.5 text-slate-700 text-xs md:text-sm">
                                    <div className="flex items-start gap-2">
                                        <User size={15} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-800 truncate">{tx.userName}</p>
                                            <p className="text-[11px] text-slate-400 truncate">{tx.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <UserCheck size={15} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-700 truncate">{tx.librarianName}</p>
                                            <p className="text-[11px] text-slate-400 truncate">{tx.librarianEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <BookOpen size={15} className="text-slate-400 shrink-0" />
                                        <span className="truncate font-medium text-slate-600">Book: {tx.bookTitle}</span>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar size={13} /> {tx.date}
                                    </span>
                                    <span className="text-emerald-700 font-extrabold text-base flex items-center">
                                        <DollarSign size={15} />{(Number(tx.amount) || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ==================== ২. লার্জ স্ক্রিন লেআউট (Desktop View Table) ==================== */}
                    <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                        <th className="p-4 pl-6">Transaction ID</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Librarian</th>
                                        <th className="p-4">Book</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 pr-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id || tx._id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                            <td className="p-4 pl-6 font-mono font-semibold text-slate-700 text-xs tracking-tight max-w-[140px] truncate">
                                                {tx.transactionId}
                                            </td>
                                            <td className="p-4 max-w-[180px]">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-semibold text-slate-800 text-sm truncate">{tx.userName}</span>
                                                    <span className="text-xs text-slate-400 truncate">{tx.userEmail}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-[180px]">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-semibold text-slate-700 text-sm truncate">{tx.librarianName}</span>
                                                    <span className="text-xs text-slate-400 truncate">{tx.librarianEmail}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 font-medium text-sm max-w-[200px] truncate">
                                                {tx.bookTitle}
                                            </td>
                                            <td className="p-4 text-emerald-700 font-bold text-sm whitespace-nowrap">
                                                ${(Number(tx.amount) || 0).toFixed(2)}
                                            </td>
                                            <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                                                {tx.date}
                                            </td>
                                            <td className="p-4 pr-6 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusStyles(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewTransactions;