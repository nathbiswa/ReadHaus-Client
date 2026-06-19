"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSingleBook, getBookReviews } from "@/lib/action/getbooks";
import { Star, Truck, Bookmark, MessageSquare, User } from "lucide-react";
import axios from "axios";

export default function BookDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // রিভিউ ফর্ম স্টেটস
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ডামি লগইন করা ইউজার ইনফো (Better Auth বা আপনার Auth স্টেট থেকে এটি আসবে)
    const currentUser = {
        name: "Ahsan Habib",
        email: "ahsan@example.com",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
    };

    const loadBookData = async () => {
        setLoading(true);
        const bookData = await getSingleBook(id);
        const reviewData = await getBookReviews(id);
        if (bookData) setBook(bookData);
        setReviews(reviewData);
        setLoading(false);
    };

    useEffect(() => {
        if (id) loadBookData();
    }, [id]);

    // রিভিউ সাবমিট হ্যান্ডলার
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return alert("Please write some review text!");

        setSubmitting(true);
        try {
            const reviewPayload = {
                bookId: id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                userImage: currentUser.image,
                rating,
                reviewText
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews`, reviewPayload);
            if (response.data.success) {
                setReviewText("");
                setRating(5);
                // ডাটাবেজ আপডেট হওয়ার পর ফ্রন্টএন্ড ডাটা রি-লোউড করা
                await loadBookData();
                alert("Review submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-white bg-gray-950 min-h-screen">Loading Book Details...</div>;
    if (!book) return <div className="text-center py-20 text-white bg-gray-950 min-h-screen">Book not found!</div>;

    return (
        <main className="bg-gray-950 text-white min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* 📚 ১. বইয়ের বিস্তারিত ইনফরমেশন সেকশন */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-2xl shadow-xl">
                    {/* কভার ইমেজ */}
                    <div className="md:col-span-4 bg-gray-950 p-6 rounded-xl border border-gray-800 flex items-center justify-center">
                        <img
                            src={book.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                            alt={book.title}
                            className="max-h-80 object-contain rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* মেটাডাটা ও ডেসক্রিপশন */}
                    <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                        <div>
                            <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs px-3 py-1 rounded font-semibold uppercase tracking-wider">
                                {book.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-100 mt-3 mb-1">{book.title}</h1>
                            <p className="text-gray-400 text-base">By <span className="text-gray-300 font-semibold">{book.author}</span></p>

                            {/* রেটিং সমীকরণ ডিসপ্লে */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(book.averageRating || 0) ? "fill-amber-400" : "text-gray-600"}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-gray-200">{book.averageRating || "0.0"}</span>
                                <span className="text-xs text-gray-500">({book.totalReviews || 0} reviews)</span>
                            </div>

                            <div className="w-full h-px bg-gray-800 my-4" />

                            <p className="text-gray-400 text-sm leading-relaxed">{book.description}</p>
                        </div>

                        {/* ডেলিভারি ফি এবং অ্যাকশন বাটন */}
                        <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Delivery Charge</p>
                                    <p className="text-xl font-bold text-emerald-400">${book.deliveryFee}</p>
                                </div>
                            </div>

                            {/* রিকোয়ারমেন্ট: স্ট্যাটাস Published হলে Request করা যাবে, Checked Out হলে Unavailable */}
                            {book.status === "Published" ? (
                                <button className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold text-sm rounded uppercase tracking-wider transition-colors shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2">
                                    <Bookmark className="w-4 h-4 fill-current" /> Request Delivery
                                </button>
                            ) : (
                                <button disabled className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-gray-500 font-semibold text-sm rounded uppercase tracking-wider cursor-not-allowed border border-gray-700 flex items-center justify-center gap-2">
                                    Unavailable (Checked Out)
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 📝 ২. ভেরিফাইড রিভিউ রাইটিং ফর্ম (Verified Review System) */}
                <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold font-serif text-gray-100 flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-amber-400" /> Write a Verified Review
                    </h3>

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {/* স্টার রেটিং সিলেক্টর */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="text-2xl transition-transform hover:scale-110"
                                    >
                                        <Star className={`w-6 h-6 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-600"}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* রিভিউ টেক্সট এরিয়া */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Review</label>
                            <textarea
                                rows="4"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Share your experience or thoughts about this book..."
                                className="w-full bg-gray-950 border border-gray-800 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-400 text-sm transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700 hover:border-amber-400 text-xs font-semibold rounded uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>

                {/* 💬 ৩. ইউজার রিভিউ লিস্ট ডিসপ্লে */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold font-serif text-gray-100 flex items-center gap-2">
                        Community Reviews ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm italic bg-gray-900 border border-gray-800 p-6 rounded-xl text-center">No reviews yet for this book. Be the first to share your thoughts!</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((rev) => (
                                <div key={rev._id} className="bg-gray-900 border border-gray-800 p-5 rounded-xl space-y-3 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={rev.userImage} alt={rev.userName} className="w-9 h-9 rounded-full object-cover border border-gray-700" />
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-200">{rev.userName}</h4>
                                                <p className="text-xs text-gray-500">{new Date(rev.dateAdded).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* রেটিং স্টার মার্ক */}
                                        <div className="flex text-amber-400 bg-gray-950/60 px-2 py-1 rounded border border-gray-800">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? "fill-amber-400" : "text-gray-700"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed pl-12">{rev.reviewText}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}