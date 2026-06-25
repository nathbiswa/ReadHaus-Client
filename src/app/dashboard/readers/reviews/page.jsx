'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
// 🚀 ToastContainer যুক্ত করা হলো যাতে এরর নোটিফিকেশন স্ক্রিনে দেখা যায়
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, SquarePen, Trash2, BookOpen, MessageSquare } from "lucide-react";

const MyReviews = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ব্যাকঅ্যান্ড থেকে ইউজারের রিভিউগুলো ফেচ করা
    useEffect(() => {
        const fetchMyReviews = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                // 🚀 ইমেইল লোয়ারকেস করে পাঠানো হলো যেন ডাটাবেজ ম্যাচিং নিখুঁত হয়
                const userEmail = user.email.toLowerCase();
                const res = await fetch(`${baseUrl}/api/user-reviews?email=${userEmail}`);

                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }

                const data = await res.json();

                // ব্যাকঅ্যান্ড ডেটা স্ট্রাকচার চেক
                if (data.success || Array.isArray(data.data)) {
                    setReviews(data.data || data);
                } else {
                    toast.error(data.message || "Failed to load reviews.");
                }
            } catch (error) {
                console.error("Reviews fetch error:", error);
                toast.error("Network error! Could not load your reviews.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyReviews();
    }, [user?.email]);

    // ২. রিভিউ ডিলিট করার হ্যান্ডলার
    const handleDeleteReview = async (reviewId) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/reviews/${reviewId}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Review deleted successfully!");
                setReviews(reviews.filter(rev => rev._id !== reviewId && rev.id !== reviewId));
            } else {
                toast.error(data.message || "Could not delete review.");
            }
        } catch (error) {
            toast.error("Failed to delete review due to network issue.");
        }
    };

    // ৩. রিভিউ এডিট করার হ্যান্ডলার
    const handleEditReview = (review) => {
        toast.info(`Edit mode triggered for: "${review.comment || review.reviewText}"`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 font-medium p-4">
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading your premium reviews...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-slate-950 min-h-screen text-slate-100 antialiased">
            {/* 🚀 নোটিফিকেশন সঠিকভাবে ট্রিগার হওয়ার জন্য কন্টেইনার */}
            <ToastContainer position="top-right" theme="dark" />

            {/* Header section */}
            <div className="mb-8 pb-6 border-b border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                        My Reviews
                    </h1>
                    <p className="text-slate-400 text-sm mt-1.5">Manage and customize your core book reviews and literature thoughts.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400">
                    <MessageSquare className="w-4 h-4" /> Total Reviews: {reviews.length}
                </div>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 max-w-4xl shadow-xl">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                    You haven't reviewed any books yet. Start sharing your journey!
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl">
                    {reviews.map((rev) => (
                        <div
                            key={rev._id || rev.id}
                            className="bg-slate-900/60 border border-slate-850 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start justify-between gap-4 transition-all duration-300 hover:border-slate-700/60 group"
                        >
                            {/* Left Side: Book Details, Rating, Date & Content */}
                            <div className="flex flex-col gap-2 w-full">
                                {/* Book Title Badge */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl w-fit">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[200px] sm:max-w-xs">{rev.bookTitle || "Unknown Book"}</span>
                                </div>

                                {/* Stars & Date Container */}
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`w-4 h-4 ${index < (rev.rating || 5)
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-slate-800"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-500">
                                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : "N/A"}
                                    </span>
                                </div>

                                {/* Review Text */}
                                <p className="text-slate-300 text-sm mt-1 font-medium leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-900/60 group-hover:border-slate-850/40 transition-colors">
                                    "{rev.comment || rev.reviewText}"
                                </p>
                            </div>

                            {/* Right Side / Mobile Bottom: Action Buttons */}
                            <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t border-slate-900 sm:border-0">
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEditReview(rev)}
                                    className="p-2 w-10 h-10 flex items-center justify-center text-indigo-400 hover:text-white bg-slate-950 hover:bg-indigo-600 rounded-xl border border-slate-850 transition-all duration-200"
                                    title="Edit Review"
                                >
                                    <SquarePen className="w-4 h-4" />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteReview(rev._id || rev.id)}
                                    className="p-2 w-10 h-10 flex items-center justify-center text-rose-400 hover:text-white bg-slate-950 hover:bg-rose-600 rounded-xl border border-slate-850 transition-all duration-200"
                                    title="Delete Review"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;