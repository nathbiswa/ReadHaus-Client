"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Truck, Calendar, Heart, ArrowLeft, ShieldCheck, User, MessageSquare, Send, DollarSign } from "lucide-react";
import { getSingleBook } from "@/lib/action/getbooks";
import axios from "axios";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function BookDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    // রিভিউ ও কমেন্ট স্টেট
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);

    // Better Auth সেশন রিসিভ করা হচ্ছে
    const { data: session } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                // 🔒 ইউজার লগইন থাকলে তার ইমেইল getSingleBook-এ পাঠানো হচ্ছে
                const userEmail = user?.email || "";
                const response = await getSingleBook(id, userEmail);

                if (response) {
                    setBook(response);
                    setReviews(response.reviews || []);
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            } finally {
                setLoading(false);
            }
        };

        // 🔒 ইউজার সেশন লোড হওয়া পর্যন্ত বা লোড হলে ডাটা ফেচ হবে
        if (id) fetchBookDetails();
    }, [id, user?.email]);

    // উইশলিস্ট হ্যান্ডলার (লগইন এবং রিডার্স রোল চেক)
    const handleWishlistClick = async () => {
        if (!user) {
            toast.info("Please login to add this book to your wishlist!");
            router.push("/login");
            return;
        }

        // 🔒 চেক করা হচ্ছে ইউজারের রোল readers কিনা
        if (user?.role !== "readers") {
            toast.error("Only users with 'readers' role can add to wishlist!");
            return;
        }

        try {
            // 📝 ব্যাকএন্ডে পাঠানোর জন্য ডাটা অবজেক্ট তৈরি
            const wishlistData = {
                userEmail: user.email,
                bookId: book._id || id,
                title: book.title,
                author: book.author,
                image: book.image,
                category: book.category,
            };

            // 🚀 axios এর বদলে native fetch ব্যবহার করা হলো
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(wishlistData), // ডাটাকে স্ট্রিং-এ কনভার্ট করা হলো
            });

            // fetch-এর রেসপন্সকে জেসন অবজেক্টে রূপান্তর
            const data = await res.json();

            // যদি রেসপন্স সফল (status 200-299) হয়
            if (res.ok && data.success) {
                toast.success("Added to wishlist successfully!");
            } else {
                // ব্যাকএন্ড থেকে পাঠানো নির্দিষ্ট এরর মেসেজ (যেমন: "ইতিমধ্যেই উইশলিস্টে আছে") দেখাবে
                toast.error(data.message || "Failed to add to wishlist");
            }

        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Network error! Something went wrong.");
        }
    };

    // পার্চেস/পেমেন্ট ফর্ম সাবমিট হ্যান্ডলার (লগইন এবং রিডার্স রোল চেক)
    const handlePurchaseSubmit = (e) => {
        if (!user) {
            e.preventDefault(); // ফর্মের অ্যাকশন বা সাবমিট হওয়া বন্ধ করবে
            toast.info("Please login to request delivery and pay!");
            router.push("/login");
            return;
        }

        // 🔒 চেক করা হচ্ছে ইউজারের রোল readers কিনা
        if (user?.role !== "readers") {
            e.preventDefault(); // ফর্ম সাবমিট হওয়া বন্ধ করবে
            toast.error("Only users with 'readers' role can purchase books!");
            return;
        }
    };

    // রিভিউ সাবমিট হ্যান্ডলার (লগইন এবং পার্চেস স্ট্যাটাস চেক)
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!user) {
            toast.error("Please login first to write a review!");
            router.push("/login");
            return;
        }

        // 🔒 ইউজার বইটি পার্চেস না করলে রিভিউ দিতে পারবে না
        if (!book?.isPurchased) {
            toast.error("You must purchase this book before leaving a review!");
            return;
        }

        const newReview = {
            _id: Date.now().toString(),
            userName: user.name || "Anonymous User",
            rating: newRating,
            comment: newComment
        };

        setReviews([newReview, ...reviews]);
        setNewComment("");
        toast.success("Review submitted successfully!");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-950 text-white text-center py-20">
                <p className="mb-4">Book not found!</p>
                <button onClick={() => router.back()} className="text-amber-400 font-bold">Go Back</button>
            </div>
        );
    }

    const status = book.status?.trim().toLowerCase();
    const isBookAvailable = status === "published" || status === "available";

    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-amber-400 mb-4 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl">

                    <div className="lg:col-span-5 bg-gray-950 rounded-2xl p-8 flex items-center justify-center border border-gray-800/60 relative">
                        <img src={book.image} alt={book.title} className="max-h-[380px] object-contain rounded-lg shadow-2xl" />
                        <span className={`absolute top-4 right-4 text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg ${isBookAvailable ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                            {isBookAvailable ? "Available" : "Checked Out"}
                        </span>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-amber-400 bg-amber-400/5 px-3 py-1 rounded-md border border-amber-400/10 uppercase tracking-wider">
                                {book.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold font-serif">{book.title}</h1>
                            <p className="text-gray-400">By <span className="text-gray-200 font-medium text-lg">{book.author}</span></p>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 bg-gray-950/40 px-3 py-1.5 rounded-lg border border-gray-800/60">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.round(book.averageRating || 0) ? "fill-amber-400" : "text-gray-700"}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-200">{book.averageRating || "0.0"}</span>
                                    <span className="text-xs text-gray-500">({book.totalReviews || 0} reviews)</span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 text-amber-400 font-bold text-sm">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Delivery Fee: ${book.deliveryFee || 0}</span>
                                </div>
                            </div>

                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Description</p>
                            <p className="text-gray-300 text-sm leading-relaxed bg-gray-950/30 p-4 rounded-xl border border-gray-800/40">{book.description}</p>
                        </div>

                        {/* 🛠️ বাটন এরিয়া */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">

                            {/* Wishlist Button */}
                            <button
                                type="button"
                                onClick={handleWishlistClick}
                                className="flex-1 py-3.5 px-6 bg-gray-950 border border-gray-800 text-gray-300 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                            >
                                <Heart className="w-4 h-4" /> Wishlist
                            </button>

                            <div className="flex-[2] flex">
                                {book?.isPurchased ? (
                                    // ১. ইউজার অলরেডি কিনে থাকলে বাটন সম্পূর্ণ লক/ডিজেবল থাকবে
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-3.5 px-6 bg-gray-800 text-gray-500 border border-gray-700/60 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Already Requested / Paid
                                    </button>
                                ) : isBookAvailable ? (
                                    // ২. ইউজার যদি না কিনে থাকে এবং বই এভেইলেবল থাকে
                                    <form action="/api/payments" method="POST" onSubmit={handlePurchaseSubmit} className="w-full">
                                        <input type="hidden" name="price" value={book.price || book.deliveryFee || 0} />
                                        <input type="hidden" name="status" value="pending" />
                                        <input type="hidden" name="bookId" value={book._id || ""} />
                                        <input type="hidden" name="title" value={book.title || ""} />
                                        <input type="hidden" name="userEmail" value={user?.email || ""} />
                                        <input type="hidden" name="userName" value={user?.name || ""} />
                                        <input type="hidden" name="userId" value={user?._id || ""} />

                                        <button
                                            type="submit"
                                            className="w-full py-3.5 px-6 bg-amber-400 text-gray-900 hover:bg-amber-500 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/10"
                                        >
                                            <ShieldCheck className="w-4 h-4" /> Request Delivery & Pay
                                        </button>
                                    </form>
                                ) : (
                                    // ৩. বই যদি এভেইলেবল না থাকে (Checked Out থাকে)
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-3.5 px-6 bg-gray-800 text-gray-500 border border-gray-700/60 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Unavailable ({book.status})
                                    </button>
                                )}
                            </div>
                        </div>

                        {book?.isPurchased && (
                            <p className="text-xs text-center text-emerald-400 font-medium">
                                You have already requested this book. Please track delivery in your dashboard.
                            </p>
                        )}
                    </div>
                </div>

                {/* 💬 রিভিউ এবং কমেন্টস সেকশন */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 space-y-8">
                    <h3 className="text-xl font-bold font-serif flex items-center gap-2 border-b border-gray-800 pb-4 text-amber-400">
                        <MessageSquare className="w-5 h-5" /> Reviews & Comments ({reviews.length})
                    </h3>

                    <form onSubmit={handleReviewSubmit} className="bg-gray-950 border border-gray-800/80 p-5 rounded-2xl space-y-4">
                        <h4 className="text-sm font-semibold text-gray-300">Write a Review</h4>
                        <div className="flex flex-wrap items-center gap-4">
                            <select
                                value={newRating}
                                onChange={(e) => setNewRating(Number(e.target.value))}
                                disabled={!book?.isPurchased}
                                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1 text-sm text-amber-400 font-bold disabled:opacity-50"
                            >
                                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <textarea
                                rows="3"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={!book?.isPurchased}
                                placeholder={book?.isPurchased ? "Share your thoughts..." : "You must purchase this book to write a review."}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={!book?.isPurchased}
                                className="absolute bottom-4 right-4 bg-amber-400 text-gray-900 p-2 rounded-xl hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        {!book?.isPurchased && (
                            <p className="text-xs text-rose-400 font-medium pt-1">
                                * Only verified buyers of this book can submit a review.
                            </p>
                        )}
                    </form>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {reviews.map((rev) => (
                            <div key={rev._id} className="bg-gray-950/40 border border-gray-800/60 p-4 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-200">{rev.userName}</span>
                                    <div className="flex text-amber-400 text-xs">
                                        {[...Array(rev.rating || 5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">{rev.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}