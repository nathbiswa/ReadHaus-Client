'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Star, SquarePen, Trash2, BookOpen } from "lucide-react";

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

                const res = await fetch(`${baseUrl}/api/user-reviews?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setReviews(data.data);
                } else {
                    toast.error(data.message || "Failed to load reviews.");
                }
            } catch (error) {
                console.error("Reviews fetch error:", error);
                toast.error("Network error! Could not load reviews.");
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
        // পরবর্তীতে এখানে এডিট মডেল (Modal) ওপেন করার কোড লিখতে পারবেন
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50 text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading your reviews...
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Reviews</h1>
                <p className="text-gray-500 mt-1">Manage your book reviews and thoughts.</p>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                    You haven't reviewed any books yet.
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl">
                    {reviews.map((rev) => (
                        <div
                            key={rev._id || rev.id}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md"
                        >
                            {/* Left Side: Book Details, Rating, Date & Content */}
                            <div className="flex flex-col gap-1.5 w-full pr-4">
                                {/* Book Title Badge */}
                                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 mb-1 bg-indigo-50/50 px-2.5 py-1 rounded-lg w-fit">
                                    <BookOpen className="w-3 h-3" />
                                    {rev.bookTitle || "Unknown Book"}
                                </div>

                                {/* Stars & Date Container */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`w-4 h-4 ${index < (rev.rating || 5)
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : "N/A"}
                                    </span>
                                </div>

                                {/* Review Text */}
                                <p className="text-slate-700 text-sm mt-1 font-medium leading-relaxed">
                                    "{rev.comment || rev.reviewText}"
                                </p>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEditReview(rev)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
                                    title="Edit Review"
                                >
                                    <SquarePen className="w-5 h-5" />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteReview(rev._id || rev.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors duration-200"
                                    title="Delete Review"
                                >
                                    <Trash2 className="w-5 h-5" />
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