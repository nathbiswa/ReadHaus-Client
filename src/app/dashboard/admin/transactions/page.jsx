'use client';
import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, DollarSign } from "lucide-react";

const ViewTransactions = () => {
    // 💡 পরবর্তীতে এপিআই থেকে ডাটা এনে এই স্টেটটি রিপ্লেস করলেই সব ডাইনামিক হয়ে যাবে
    const [transactions, setTransactions] = useState([
        {
            id: "1",
            transactionId: "TXN-1781499200166",
            userName: "Derek Peters",
            userEmail: "a@b.com",
            librarianName: "James Rodriguez",
            librarianEmail: "james@heritagebooks.com",
            bookTitle: "Quia sunt eum incidu",
            amount: 58.00,
            date: "Jun 15, 2026",
            status: "Delivered"
        },
        {
            id: "2",
            transactionId: "TXN-1781495571444",
            userName: "Dominique Shepard",
            userEmail: "duhecuhix@mailinator.com",
            librarianName: "James Rodriguez",
            librarianEmail: "james@heritagebooks.com",
            bookTitle: "Quia sunt eum incidu",
            amount: 58.00,
            date: "Jun 15, 2026",
            status: "Delivered"
        },
        {
            id: "3",
            transactionId: "TXN-1781029320553",
            userName: "Admin",
            userEmail: "admin@gmail.com",
            librarianName: "James Rodriguez",
            librarianEmail: "james@heritagebooks.com",
            bookTitle: "The Midnight Library",
            amount: 4.00,
            date: "Jun 10, 2026",
            status: "Pending"
        },
        {
            id: "4",
            transactionId: "TXN-1781023546720",
            userName: "Dominique Shepard",
            userEmail: "duhecuhix@mailinator.com",
            librarianName: "James Rodriguez",
            librarianEmail: "james@heritagebooks.com",
            bookTitle: "Project Hail Mary",
            amount: 5.00,
            date: "Jun 9, 2026",
            status: "Pending"
        }
    ]);

    // স্ট্যাটাস অনুযায়ী ব্যাজ ডিজাইন করার হেল্পার ফাংশন
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'pending':
                return 'bg-amber-50 text-amber-600 border border-amber-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Transactions
                    </h1>
                    <p className="text-slate-500 mt-1">
                        View all platform transactions. <span className="font-semibold text-indigo-600">({transactions.length} total)</span>
                    </p>
                </div>

                {/* Search & Utilities Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors shadow-sm"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm" title="Filter Transactions">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 🚀 মডার্ন ট্রানজেকশন হিস্ট্রি টেবিল */}
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
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                        {/* Transaction ID */}
                                        <td className="p-4 font-mono font-semibold text-slate-700 text-xs tracking-tight">
                                            {tx.transactionId}
                                        </td>

                                        {/* User Info (Name + Email stacking) */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-sm">{tx.userName}</span>
                                                <span className="text-xs text-slate-400">{tx.userEmail}</span>
                                            </div>
                                        </td>

                                        {/* Librarian Info (Name + Email stacking) */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700 text-sm">{tx.librarianName}</span>
                                                <span className="text-xs text-slate-400">{tx.librarianEmail}</span>
                                            </div>
                                        </td>

                                        {/* Book Title */}
                                        <td className="p-4 text-slate-700 font-medium text-sm break-words max-w-[180px]">
                                            {tx.bookTitle}
                                        </td>

                                        {/* Amount */}
                                        <td className="p-4 text-amber-700 font-bold text-sm">
                                            ${tx.amount.toFixed(2)}
                                        </td>

                                        {/* Date */}
                                        <td className="p-4 text-slate-500 text-sm">
                                            {tx.date}
                                        </td>

                                        {/* Status */}
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