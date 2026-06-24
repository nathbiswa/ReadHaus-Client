"use client";

import { useEffect, useState } from "react";
import { getAllBooks } from "@/lib/action/getbooks";
import BookCard from "@/components/books/BookCard";

export default function BrowseBooks() {
    // ফিল্টার এবং পেহিনেশন স্টেটস
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [availability, setAvailability] = useState("All");
    const [maxFee, setMaxFee] = useState(100); // সর্বোচ্চ ডেলিভারি ফি ডিফল্ট ১০০
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 🛠️ ফিক্স: ক্যাটাগরি লিস্টের ভ্যালু ডাটাবেজের ভ্যালুর সাথে ম্যাচ করানো হলো
    const categories = [
        { label: "All Categories", value: "All" },
        { label: "Fiction & Literature", value: "Fiction" },
        { label: "Non-Fiction & Facts", value: "Non-Fiction" },
        { label: "Mystery & Thriller", value: "Mystery" },
        { label: "Sci-Fi & Technology", value: "Sci-Fi" },
        { label: "Biography & History", value: "Biography" }
    ];

    // ডাটা লোড করার ফাংশন
    const loadBooks = async () => {
        setLoading(true);
        try {
            // ফিল্টার অবজেক্ট তৈরি করে অ্যাকশন ফাংশনে পাঠানো হচ্ছে
            const queryParams = {
                search,
                category,
                availability,
                maxFee,
                page,
                limit: 6 // প্রতি পেজে ৬টি করে বই দেখাবে
            };

            const response = await getAllBooks(queryParams);

            // ব্যাকএন্ড মেটা-ডাটা অনুযায়ী স্টেট সেট করা
            if (response && response.success) {
                setBooks(response.data || []);
                setTotalPages(response.totalPages || 1);
            } else if (Array.isArray(response)) {
                // সেফটি ব্যাকআপ (যদি সরাসরি অ্যারে আসে)
                setBooks(response);
            }
        } catch (error) {
            console.error("Error loading filtered books:", error);
        } finally {
            setLoading(false);
        }
    };

    // সার্চ ও ফিল্টার চেঞ্জ হলে ডাটা রিলোড করা এবং পেজ ১-এ রিসেট করা
    useEffect(() => {
        setPage(1);
        loadBooks();
    }, [search, category, availability, maxFee]);

    // শুধু পেজ চেঞ্জ হলে ডাটা লোড করা
    useEffect(() => {
        loadBooks();
    }, [page]);

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto text-white bg-gray-950 min-h-screen">

            {/* Header Section */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold font-serif text-gray-100 mb-2">
                    Browse Our Collection
                </h2>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    Find your next great read using our advanced multi-filter system.
                </p>
                <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
            </div>

            {/* 🔍 অ্যাডভান্সড ফিল্টারিং প্যানেল */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl mb-10 shadow-lg space-y-6 md:space-y-0 md:flex md:items-center md:gap-4 flex-wrap">

                {/* ১. নাম দিয়ে সার্চ */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Search by Name</label>
                    <input
                        type="text"
                        placeholder="Search book title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                    />
                </div>

                {/* ২. ক্যাটাগরি ফিল্টার */}
                <div className="w-full md:w-52">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                    >
                        {categories.map((cat, i) => (
                            <option key={i} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* ৩. অ্যাভেইলেবিলিটি ফিল্টার */}
                <div className="w-full md:w-44">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                    <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 text-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                    >
                        <option value="All">All Status</option>
                        <option value="Published">Available</option>
                        <option value="Checked Out">Unavailable</option>
                    </select>
                </div>

                {/* ৪. ডেলিভারি ফি রেঞ্জ ফিল্টার */}
                <div className="w-full md:w-48">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Max Delivery Fee</label>
                        <span className="text-xs font-bold text-amber-400">${maxFee}</span>
                    </div>
                    <input
                        type="range"
                        min="0" // ডেলিভারি ফি সর্বনিম্ন ০ থেকে শুরু হতে পারে
                        max="100"
                        value={maxFee}
                        onChange={(e) => setMaxFee(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                    />
                </div>
            </div>

            {/* 📚 বুক গ্রিড ডিসপ্লে */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-gray-900 border border-gray-800 h-96 rounded-xl" />
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-lg">No books found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            _id={book._id}
                            title={book.title}
                            author={book.author}
                            description={book.description}
                            image={book.image}
                            category={book.category}
                            averageRating={book.averageRating}
                            totalReviews={book.totalReviews}
                            deliveryFee={book.deliveryFee}
                            status={book.status}
                            dateAdded={book.createdAt} // ডাটাবেজে createdAt ফিল্ড রয়েছে
                        />
                    ))}
                </div>
            )}

            {/* 📄 সার্ভার সাইড পেহিনেশন নেভিগেশন কন্ট্রোল */}
            {!loading && books.length > 0 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-800 rounded-lg bg-gray-900 text-sm font-semibold hover:border-amber-400 text-gray-100 disabled:opacity-40 disabled:hover:border-gray-800 transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-400">
                        Page <span className="text-amber-400 font-bold">{page}</span> of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-800 rounded-lg bg-gray-900 text-sm font-semibold hover:border-amber-400 text-gray-100 disabled:opacity-40 disabled:hover:border-gray-800 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}