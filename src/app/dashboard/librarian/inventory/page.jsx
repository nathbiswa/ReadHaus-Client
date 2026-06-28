'use client';

import { useState, useEffect } from "react";
import { Trash2, Eye, EyeOff, Search, Plus, Edit2, BookOpen, X, Save, DollarSign, Tag } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ManageInventory = () => {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", category: "", deliveryFee: 0 });

    // ১. ডাটা ফেচ করার হুক
    useEffect(() => {
        const fetchInventory = async () => {
            if (sessionLoading || !session?.user?.email) return;
            let token = null;
            try {
                const { data } = await authClient.token();
                if (data) token = data.token;
            } catch (err) {
                console.error("Failed to fetch token:", err);
            }

            if (!token) {
                toast.error("Authentication token missing!");
                return;
            }

            // console.log("Token:", token);
            try {
                setLoading(true);
                const timestamp = new Date().getTime();
                const userEmail = session.user.email;
                const res = await fetch(
                    `${API_URL}/api/librarian/books?email=${userEmail}&_t=${timestamp}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) throw new Error("Failed to connect server");

                const data = await res.json();
                if (data.success) {
                    setBooks(data.data || []);
                } else {
                    toast.error(data.message || "Failed to fetch inventory.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Network error! Could not load inventory.");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [session?.user?.email, sessionLoading]);

    // 🔄 ২. পাবলিশিং পাওয়ার টগল লজিক
    const handleToggleStatus = async (bookId, currentStatus) => {
        const statusClean = currentStatus?.trim().toLowerCase();

        if (statusClean === 'pending approval' || statusClean === 'pending') {
            toast.error("You cannot publish a book that is Pending Approval!");
            return;
        }

        const newStatus = statusClean === 'published' ? 'Unpublished' : 'Published';
        const previousBooks = [...books];

        setBooks(books.map(b => (b.id === bookId || b._id === bookId) ? { ...b, status: newStatus } : b));

        try {
            const { data: tokenData } = await authClient.token();
            const token = tokenData?.token;
            const res = await fetch(`${API_URL}/api/librarian/books/${bookId}/toggle-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(`Book status changed to ${newStatus}!`);
            } else {
                setBooks(previousBooks);
                toast.error(data.message || "Failed to update status.");
            }
        } catch (error) {
            setBooks(previousBooks);
            toast.error("Network error while updating status.");
        }
    };

    // 🗑️ ৩. বই ডিলিট করা
    const handleDeleteBook = async (bookId) => {
        if (!confirm("Are you sure you want to delete this book?")) return;

        try {
            const token = localStorage.getItem("better-auth.session-token") || "";

            const res = await fetch(`${API_URL}/api/librarian/books/${bookId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Book deleted successfully!");
                setBooks(books.filter(b => b.id !== bookId && b._id !== bookId));
            } else {
                toast.error(data.message || "Failed to delete book.");
            }
        } catch (error) {
            toast.error("Something went wrong while deleting.");
        }
    };

    // 📝 ৪. এডিট মোডাল ওপেন
    const openEditModal = (book) => {
        setEditingBook(book);

        const categoryValue = typeof book.category === 'object' && book.category !== null
            ? (book.category.name || book.category.title || "")
            : (book.category || "");

        setEditForm({
            title: book.bookTitle || book.title || book.name || "",
            category: categoryValue,
            deliveryFee: book.deliveryFee || 0
        });
        setIsEditModalOpen(true);
    };

    // 💾 ৫. এডিট সাবমিট/সেভ করা
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingBook) return;
        const bookId = editingBook.id || editingBook._id;

        try {
            const token = await authClient.token();

            const res = await fetch(`${API_URL}/api/librarian/books/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.data.token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    bookTitle: editForm.title,
                    title: editForm.title,
                    category: editForm.category,
                    deliveryFee: Number(editForm.deliveryFee)
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Book updated successfully!");

                setBooks(books.map(b => (b.id === bookId || b._id === bookId) ? {
                    ...b,
                    bookTitle: editForm.title,
                    title: editForm.title,
                    category: typeof b.category === 'object' && b.category !== null
                        ? { ...b.category, name: editForm.category }
                        : editForm.category,
                    deliveryFee: editForm.deliveryFee
                } : b));

                setIsEditModalOpen(false);
            } else {
                toast.error(data.message || "Failed to update book.");
            }
        } catch (error) {
            toast.error("Network error while updating book.");
        }
    };

    const filteredBooks = books ? books.filter(book => {
        const title = (book.bookTitle || book.title || book.name || "").toLowerCase();
        const categoryRaw = book.category;
        const category = (typeof categoryRaw === 'object' && categoryRaw !== null
            ? (categoryRaw.name || categoryRaw.title || "")
            : (categoryRaw || "")).toLowerCase();

        return (
            title.includes(searchQuery.toLowerCase()) ||
            category.includes(searchQuery.toLowerCase())
        );
    }) : [];

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'published': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'pending approval':
            case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-100';
            case 'unpublished': return 'bg-rose-50 text-rose-700 border border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    if (loading || sessionLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Spinner size="lg" color="indigo" aria-label="Loading Inventory" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-slate-50/50 min-h-screen text-slate-800 antialiased">
            <ToastContainer position="top-right" theme="colored" />

            {/* Header Section */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Manage Inventory</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">View and manage your listed books.</p>
                </div>

                {/* Search Bar & Button Container */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search listed books..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full sm:w-64 transition-colors shadow-sm"
                        />
                    </div>
                    <Link href="/dashboard/librarian/addbook" className="w-full sm:w-auto">
                        <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm w-full">
                            <Plus className="w-4 h-4" />
                            Add Book
                        </button>
                    </Link>
                </div>
            </div>

            {/* Main Content View */}
            {filteredBooks.length > 0 ? (
                <>
                    {/* 1. Desktop & Tablet View (Table structure) */}
                    <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100">
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-2/5">Title</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fee</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredBooks.map((book) => {
                                        const bookId = book.id || book._id;
                                        const isPending = book.status?.toLowerCase() === 'pending approval' || book.status?.toLowerCase() === 'pending';
                                        const isPublished = book.status?.toLowerCase() === 'published';

                                        return (
                                            <tr key={bookId} className="hover:bg-slate-50/40 transition-colors duration-150 group">
                                                <td className="p-4 font-semibold text-slate-800 max-w-[280px] break-words">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-indigo-500 transition-colors" />
                                                        <span>{book.bookTitle || book.title || book.name || "Untitled Book"}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600 font-medium">
                                                    {typeof book.category === 'object' && book.category !== null
                                                        ? (book.category.name || book.category.title || "N/A")
                                                        : (book.category || "N/A")
                                                    }
                                                </td>
                                                <td className="p-4 text-slate-700 font-semibold">${Number(book.deliveryFee || 0).toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${getStatusBadgeClass(book.status)}`}>
                                                        {book.status || "Pending Approval"}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right pr-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleStatus(bookId, book.status)}
                                                            disabled={isPending}
                                                            className={`p-2 rounded-xl border transition-all ${isPending
                                                                ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50"
                                                                : isPublished
                                                                    ? "bg-amber-50/60 border-amber-100 text-amber-600 hover:bg-amber-100"
                                                                    : "bg-emerald-50/60 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                                                                }`}
                                                            title={isPending ? "Pending approval books cannot be published" : isPublished ? "Unpublish Book" : "Publish Book"}
                                                        >
                                                            {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>

                                                        <button
                                                            onClick={() => openEditModal(book)}
                                                            className="p-2 bg-indigo-50/50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                                                            title="Edit Book"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>

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
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. Mobile View (Card-based layout) */}
                    <div className="block sm:hidden space-y-4">
                        {filteredBooks.map((book) => {
                            const bookId = book.id || book._id;
                            const isPending = book.status?.toLowerCase() === 'pending approval' || book.status?.toLowerCase() === 'pending';
                            const isPublished = book.status?.toLowerCase() === 'published';

                            return (
                                <div key={bookId} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2.5">
                                            <BookOpen className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-bold text-slate-900 leading-snug break-words max-w-[200px]">
                                                    {book.bookTitle || book.title || book.name || "Untitled Book"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                                                        {typeof book.category === 'object' && book.category !== null
                                                            ? (book.category.name || book.category.title || "N/A")
                                                            : (book.category || "N/A")
                                                        }
                                                    </span>
                                                    <span className="flex items-center gap-0.5 font-semibold text-slate-700">
                                                        <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                                                        {Number(book.deliveryFee || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0 ${getStatusBadgeClass(book.status)}`}>
                                            {book.status || "Pending Approval"}
                                        </span>
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 w-full">
                                        <button
                                            onClick={() => handleToggleStatus(bookId, book.status)}
                                            disabled={isPending}
                                            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex-1 ${isPending
                                                ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed opacity-50"
                                                : isPublished
                                                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                }`}
                                        >
                                            {isPublished ? (
                                                <>
                                                    <EyeOff className="w-3.5 h-3.5" /> Unpublish
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-3.5 h-3.5" /> Publish
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => openEditModal(book)}
                                            className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteBook(bookId)}
                                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-sm text-slate-400 shadow-sm">
                    No books found in inventory.
                </div>
            )}

            {/* Edit Modal Popup */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-indigo-500" /> Edit Book Details
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Book Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Delivery Fee ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={editForm.deliveryFee}
                                    onChange={(e) => setEditForm({ ...editForm, deliveryFee: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                                />
                            </div>

                            {/* Modal Footer/Actions */}
                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-6 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 font-medium text-sm rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageInventory;