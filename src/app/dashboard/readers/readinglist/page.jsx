'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { BookOpen } from "lucide-react"; // স্ক্রিনশটের ইন্ডিগো আইকনটির জন্য

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

                // ব্যাকএন্ড থেকে ইউজারের রিসিভড বইয়ের লিস্ট আনা
                const res = await fetch(`${baseUrl}/api/user-deliveries?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    // শুধুমাত্র 'Delivered' স্ট্যাটাসের বইগুলো ফিল্টার করে রিডিং লিস্টে দেখানো হচ্ছে
                    const deliveredBooks = data.data.filter(item => item.status?.toLowerCase() === 'delivered');
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
            <div className="p-8 text-center text-gray-500 font-medium min-h-screen bg-gray-50/50">
                Loading your reading list...
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Reading List</h1>
                <p className="text-gray-500 mt-1">Books you've successfully received.</p>
            </div>

            {/* Books Grid Layout */}
            {books.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                    No books in your reading list yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id || book._id}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center justify-center min-h-[220px] transition-all duration-200 hover:shadow-md"
                        >
                            {/* Indigo Book Icon Container */}
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-indigo-100">
                                <BookOpen className="w-8 h-8" />
                            </div>

                            {/* Book Title */}
                            <h3 className="font-bold text-slate-800 text-base line-clamp-2 max-w-[180px] mb-1">
                                {book.bookTitle}
                            </h3>

                            {/* Delivered Status Label */}
                            <span className="text-xs text-gray-400 font-medium capitalize">
                                {book.status || "Delivered"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReadingList;