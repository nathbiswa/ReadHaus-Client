'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { BookOpen } from "lucide-react";

const ReadingList = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReadingList = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                // ব্যাকঅ্যান্ড থেকে ইউজারের রিসিভড বইয়ের লিস্ট আনা
                const res = await fetch(`${baseUrl}/api/user-deliveries?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    // 🚀 'complete', 'completed', এবং 'delivered' সব ধরনের সফল স্ট্যাটাসকে কভার করা হলো
                    const deliveredBooks = data.data.filter(item =>
                        ['complete', 'completed', 'delivered', 'read'].includes(item.status?.toLowerCase())
                    );
                    setBooks(deliveredBooks);
                } else {
                    toast.error(data.message || "Failed to load reading list.");
                }
            } catch (error) {
                console.error("Reading list fetch error:", error);
                toast.error("Network error! Could not load reading list.");
            } finally {
                setLoading(false);
            }
        };

        fetchReadingList();
    }, [user?.email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50 text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading your reading list...
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Reading List</h1>
                <p className="text-gray-500 mt-1">Books you've successfully received and read.</p>
            </div>

            {/* Books Grid Layout */}
            {books.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                    No books in your reading list yet. Start completing your book deliveries!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center justify-center min-h-[220px] transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                        >
                            {/* Indigo Book Icon Container */}
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-indigo-100">
                                <BookOpen className="w-8 h-8" />
                            </div>

                            {/* Book Title */}
                            <h3 className="font-bold text-slate-800 text-base line-clamp-2 max-w-[180px] mb-1" title={book.bookTitle}>
                                {book.bookTitle}
                            </h3>

                            {/* Status Label */}
                            <span className="px-2.5 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium rounded-full capitalize mt-1">
                                {book.status?.toLowerCase() === 'complete' ? 'Completed' : book.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReadingList;