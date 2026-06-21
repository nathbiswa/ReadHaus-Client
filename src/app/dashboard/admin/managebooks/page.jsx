'use client';
import { useState } from "react";
import { Trash2, Eye, EyeOff, Search, SlidersHorizontal, BookOpen } from "lucide-react";

const ManageAllBooks = () => {
    // 💡 পরবর্তীতে এপিআই কলের মাধ্যমে ডাটাবেজ থেকে ডেটা এনে এই স্টেটটি রিপ্লেস করলেই সব ডাইনামিক হয়ে যাবে
    const [books, setBooks] = useState([
        {
            id: "1",
            title: "Voluptatibus dolor q",
            author: "Fuga Quaerat commod",
            category: "History",
            fee: 30.00,
            librarian: "James Rodriguez",
            status: "Pending Approval"
        },
        {
            id: "2",
            title: "Quia sunt eum incidu",
            author: "Quas consequatur od",
            category: "Romance",
            fee: 58.00,
            librarian: "James Rodriguez",
            status: "Unpublished"
        },
        {
            id: "3",
            title: "Proident sunt sunt",
            author: "Eos dolores pariatu",
            category: "History",
            fee: 2.00,
            librarian: "James Rodriguez",
            status: "Published"
        },
        {
            id: "4",
            title: "The Silent Patient",
            author: "Alex Michaelides",
            category: "Mystery",
            fee: 4.50,
            librarian: "Sarah Mitchell",
            status: "Published"
        },
        {
            id: "5",
            title: "Project Hail Mary",
            author: "Andy Weir",
            category: "Sci-Fi",
            fee: 5.00,
            librarian: "James Rodriguez",
            status: "Checked Out"
        }
    ]);

    // স্ট্যাটাস অনুযায়ী ডাইনামিক কালার থিম জেনারেট করার ফাংশন
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'pending approval':
                return 'bg-amber-50 text-amber-700 border border-amber-100';
            case 'unpublished':
                return 'bg-rose-50 text-rose-700 border border-rose-100';
            case 'checked out':
                return 'bg-blue-50 text-blue-700 border border-blue-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    // ফোর্সবলি আনপাবলিশ/পাবলিশ স্টেট টগল হ্যান্ডলার (আপাতত ফ্রন্টএন্ড স্টেট আপডেট দেখাবে)
    const handleTogglePublish = (id, currentStatus) => {
        const newStatus = currentStatus?.toLowerCase() === 'published' ? 'Unpublished' : 'Published';
        setBooks(prev =>
            prev.map(book => book.id === id ? { ...book, status: newStatus } : book)
        );
    };

    // বই সম্পূর্ণ ডিলিট করার হ্যান্ডলার
    const handleDeleteBook = (id) => {
        if (confirm("Are you sure you want to forcibly delete this book from the platform permanently?")) {
            setBooks(prev => prev.filter(book => book.id !== id));
        }
    };

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Manage All Books
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Oversee all books on the platform. <span className="font-semibold text-indigo-600">({books.length} total)</span>
                    </p>
                </div>

                {/* Search & Action Box */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search platform books..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors shadow-sm"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm" title="Filters">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 🚀 মডার্ন গ্লোবাল বুক টেবিল */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Title</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Author</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fee</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Librarian</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                                        No platform books listed.
                                    </td>
                                </tr>
                            ) : (
                                books.map((book) => (
                                    <tr key={book.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                        {/* Book Title */}
                                        <td className="p-4 font-semibold text-slate-800 break-words max-w-[220px]">
                                            {book.title}
                                        </td>

                                        {/* Author */}
                                        <td className="p-4 text-slate-600 text-sm font-medium">
                                            {book.author}
                                        </td>

                                        {/* Category */}
                                        <td className="p-4 text-slate-500 text-sm">
                                            {book.category}
                                        </td>

                                        {/* Fee */}
                                        <td className="p-4 text-slate-800 font-semibold text-sm">
                                            ${book.fee.toFixed(2)}
                                        </td>

                                        {/* Librarian Name */}
                                        <td className="p-4 text-slate-600 text-sm">
                                            {book.librarian}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${getStatusStyles(book.status)}`}>
                                                {book.status}
                                            </span>
                                        </td>

                                        {/* Admin Control Actions */}
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Forcibly Unpublish/Publish Toggle */}
                                                <button
                                                    onClick={() => handleTogglePublish(book.id, book.status)}
                                                    className={`p-2 rounded-xl border transition-all ${book.status?.toLowerCase() === 'unpublished'
                                                        ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100"
                                                        : "bg-indigo-50/50 border-indigo-100 text-indigo-600 hover:bg-indigo-100"
                                                        }`}
                                                    title={book.status?.toLowerCase() === 'unpublished' ? "Publish Book" : "Forcibly Unpublish Book"}
                                                >
                                                    {book.status?.toLowerCase() === 'unpublished' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>

                                                {/* Hard Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    className="p-2 text-rose-600 bg-rose-50/50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
                                                    title="Completely Delete Listing"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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

export default ManageAllBooks;