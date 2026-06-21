'use client';
import { useState } from "react";
import { Trash2, Eye, Search, SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";

const ManageInventory = () => {
    // 💡 ভবিষ্যতে ব্যাকএন্ড থেকে আসা ডেটা এই অ্যারেতে রিপ্লেস করে দিলেই হবে
    const [books, setBooks] = useState([
        {
            id: "1",
            bookTitle: "Voluptatibus dolor q",
            category: "History",
            deliveryFee: 30.00,
            status: "Pending Approval"
        },
        {
            id: "2",
            bookTitle: "Quia sunt eum incidu",
            category: "Romance",
            deliveryFee: 58.00,
            status: "Published"
        },
        {
            id: "3",
            bookTitle: "Proident sunt sunt",
            category: "History",
            deliveryFee: 2.00,
            status: "Published"
        }
    ]);

    // স্ট্যাটাস অনুযায়ী ব্যাজ কালার দেওয়ার স্ট্যাটিক ফাংশন
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'pending approval':
                return 'bg-amber-50 text-amber-700 border border-amber-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Inventory</h1>
                    <p className="text-slate-500 mt-1">View and manage your listed books.</p>
                </div>

                {/* Search and Filter Inputs */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search listed books..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors shadow-sm"
                        />
                    </div>

                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm" title="Filter">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    <Link href="/dashboard/librarian/addbook">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            Add Book
                        </button>
                    </Link>
                </div>
            </div>

            {/* 🚀 মডার্ন টেবিল কন্টেইনার */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3">Title</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fee</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                    {/* Book Title */}
                                    <td className="p-4 font-semibold text-slate-800 break-words max-w-[250px]">
                                        {book.bookTitle}
                                    </td>

                                    {/* Category */}
                                    <td className="p-4 text-slate-600 font-medium">
                                        {book.category}
                                    </td>

                                    {/* Fee */}
                                    <td className="p-4 text-slate-700 font-semibold">
                                        ${book.deliveryFee.toFixed(2)}
                                    </td>

                                    {/* Status */}
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${getStatusBadgeClass(book.status)}`}>
                                            {book.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Hide/Archive Button */}
                                            <button
                                                className="p-2 bg-indigo-50/50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                                                title="Toggle Visibility"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                className="p-2 text-rose-600 bg-rose-50/50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
                                                title="Delete Book"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageInventory;