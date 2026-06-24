'use client';

import { useState, useEffect } from "react";
import { Trash2, Eye, EyeOff, Search, SlidersHorizontal, Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ManageInventory = () => {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // 🚀 মঙ্গোডিবি থেকে লাইভ ইনভেন্টরি ডেটা ফেচ করার হুক
    useEffect(() => {
        const fetchInventory = async () => {
            if (sessionLoading || !session?.user?.email) return;

            try {
                const timestamp = new Date().getTime();
                const res = await fetch(
                    `${API_URL}/api/librarian/books?email=${session.user.email}&_t=${timestamp}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setBooks(data.data || []);
                    } else {
                        toast.error(data.message || "Failed to fetch inventory.");
                    }
                }
            } catch (error) {
                console.error("Inventory fetch error:", error);
                toast.error("Network error! Could not load inventory.");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [session?.user?.email, sessionLoading]);

    // 🔄 Status Toggle Functionality (Publish/Unpublish)
    const handleToggleStatus = async (bookId, currentStatus) => {
        const normalizedStatus = currentStatus?.toLowerCase();

        // কন্ডিশন: Pending Approval হলে লাইব্রেরিয়ান চেঞ্জ করতে পারবেন না
        if (normalizedStatus === 'pending approval' || normalizedStatus === 'pending') {
            toast.warn("You cannot publish a book that is pending approval!");
            return;
        }

        // নতুন স্ট্যাটাস ডিটারমাইন করা (Published <-> Unpublished)
        const newStatus = normalizedStatus === 'published' ? 'Unpublished' : 'Published';

        try {
            const res = await fetch(`${API_URL}/api/librarian/books/${bookId}/toggle-status`, {
                method: "PATCH", // অথবা আপনার ব্যাকএন্ড রাউট অনুযায়ী PUT/POST
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(`Book successfully ${newStatus.toLowerCase()}!`);
                // রিয়েল-টাইম স্টেট আপডেট
                setBooks(books.map(book =>
                    (book.id === bookId || book._id === bookId) ? { ...book, status: newStatus } : book
                ));
            } else {
                toast.error(data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error("Something went wrong while updating status.");
        }
    };

    // 🗑️ ডাইনামিক ডিলিট ফাংশনালিটি
    const handleDeleteBook = async (bookId) => {
        if (!confirm("Are you sure you want to delete this book?")) return;

        try {
            const res = await fetch(`${API_URL}/api/librarian/books/${bookId}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Book deleted successfully!");
                setBooks(books.filter(book => book.id !== bookId && book._id !== bookId));
            } else {
                toast.error(data.message || "Failed to delete book.");
            }
        } catch (error) {
            console.error("Delete book error:", error);
            toast.error("Something went wrong while deleting.");
        }
    };

    // 🔍 ক্লায়েন্ট-সাইড লাইভ সার্চ ফিল্টার
    const filteredBooks = books.filter(book =>
        book.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // স্ট্যাটাস অনুযায়ী ব্যাজ কালার দেওয়ার ফাংশন
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'pending approval':
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-100';
            case 'unpublished':
                return 'bg-rose-50 text-rose-700 border border-rose-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    if (loading || sessionLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Spinner size="lg" color="indigo" label="Inventory লাইভ ডাটা লোড হচ্ছে..." />
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Inventory</h1>
                    <p className="text-slate-500 mt-1">View and manage your listed books.</p>
                </div>

                {/* Search and Action Buttons */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search listed books..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => {
                                    const bookId = book.id || book._id;
                                    const isPending = book.status?.toLowerCase() === 'pending approval' || book.status?.toLowerCase() === 'pending';
                                    const isPublished = book.status?.toLowerCase() === 'published';

                                    return (
                                        <tr key={bookId} className="hover:bg-slate-50/40 transition-colors duration-150">
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
                                                ${Number(book.deliveryFee || 0).toFixed(2)}
                                            </td>

                                            {/* Status */}
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${getStatusBadgeClass(book.status)}`}>
                                                    {book.status || "Pending Approval"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* Toggle Publish/Unpublish Power Button */}
                                                    <button
                                                        onClick={() => handleToggleStatus(bookId, book.status)}
                                                        disabled={isPending}
                                                        className={`p-2 rounded-xl border transition-all ${isPending
                                                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                                            : isPublished
                                                                ? "bg-amber-50/60 border-amber-100 text-amber-600 hover:bg-amber-150"
                                                                : "bg-emerald-50/60 border-emerald-100 text-emerald-600 hover:bg-emerald-150"
                                                            }`}
                                                        title={isPending ? "Cannot publish pending approval book" : isPublished ? "Toggle to Unpublish" : "Toggle to Publish"}
                                                    >
                                                        {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>

                                                    {/* Edit Button */}
                                                    <Link href={`/dashboard/librarian/editbook/${bookId}`}>
                                                        <button
                                                            className="p-2 bg-indigo-50/50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                                                            title="Edit Book"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    </Link>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteBook(bookId)}
                                                        className="p-2 text-rose-600 bg-rose-50/50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
                                                        title="Delete Book"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-sm text-slate-400">
                                        No books found in your inventory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageInventory;