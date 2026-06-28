"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useParams সরাসরি ব্যবহার করা হবে
import { Star, Heart, ArrowLeft, ShieldCheck, MessageSquare, Send, DollarSign, Edit, Trash2, EyeOff } from "lucide-react";
import { getSingleBook } from "@/lib/action/getbooks";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function BookDetailsPage() {
    // 🛠️ ফিক্স ১: ক্লায়েন্ট কম্পোনেন্টে সরাসরি useParams() থেকে id নেওয়া হলো
    const params = useParams();
    const id = params?.id;

    const router = useRouter();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    console.log("BOOk", book);

    // রিভিউ ও কমেন্ট স্টেট
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);

    // Better Auth সেশন
    const { data: session } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!id || typeof id !== "string") return;

            try {
                setLoading(true);
                const userEmail = user?.email || "";
                const response = await getSingleBook(id, userEmail);

                if (response) {
                    setBook(response);
                    setReviews(response.reviews || []);

                    if (response.isWishlisted) {
                        setIsWishlisted(true);
                    }
                } else {
                    console.error("Backend returned null or undefined for ID:", id);
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
                toast.error("Failed to load book details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, user?.email]);

    // ❤️ উইশলিস্ট হ্যান্ডলার
    const handleWishlistClick = async () => {
        // 🌟 ১. সবার আগে ইউজার লগইন আছে কিনা চেক করা (Best Practice)
        if (!user) {
            toast.info("Please login to add this book to your wishlist!");
            router.push("/login");
            return;
        }

        // 🌟 ২. ইউজারের রোল 'readers' কিনা চেক করা
        if (user?.role !== "readers") {
            toast.error("Only users with 'readers' role can add to wishlist!");
            return;
        }

        // 🌟 ৩. ফ্রন্টএন্ড স্টেটে যদি অলরেডি ট্রু থাকে, তবে এপিআই কল না করেই টোস্ট দেখাবে
        if (isWishlisted) {
            toast.warning("This book is already in your wishlist!");
            return;
        }

        // 🌟 ৪. অথেন্টিকেশন টোকেন সংগ্রহ করা
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

        // 🌟 ৫. উইশলিস্টের জন্য ডাটা অবজেক্ট তৈরি
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

            const wishlistData = {
                userEmail: user.email,
                bookId: book._id || id,
                bookTitle: book.title,
                author: book.author,
                bookImage: book.image,
                category: book.category,
                price: book.price || book.deliveryFee || 0,
                createdAt: new Date().toISOString()
            };

            // 🌟 ৬. এপিআই রিকোয়েস্ট পাঠানো (ফিক্সড হেডারসহ)
            const res = await fetch(`${baseUrl}/api/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // দুটি হেডার এখন একই অবজেক্টে আছে
                },
                body: JSON.stringify(wishlistData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Added to wishlist successfully!");
                setIsWishlisted(true);
            } else {
                // ব্যাকএন্ডে ডুপ্লিকেট বা অন্য কোনো সমস্যা হলে সেই মেসেজটি টোস্ট আকারে দেখাবে
                toast.warning(data.message || "Failed to add to wishlist");

                if (data.message?.includes("already")) {
                    setIsWishlisted(true);
                }
            }
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Network error! Something went wrong.");
        }
    };

    // পার্চেস/পেমেন্ট ফর্ম সাবমিট হ্যান্ডলার (আপডেটেড)
    const handlePurchaseSubmit = () => { // এখানে আর 'e' বা e.preventDefault() লাগবে না
        if (!user) {
            toast.info("Please login to request delivery and pay!");
            router.push("/login");
            return;
        }

        if (user?.role !== "readers") {
            toast.error("Only users with 'readers' role can purchase books!");
            return;
        }

        // 🌟 যদি অলরেডি কেনা থাকে, তবে এখানেই কোড থেমে যাবে, ফর্ম পর্যন্ত যাবেই না
        if (book?.isPurchased) {
            toast.warning("You have already purchased or requested this book!");
            return;
        }

        // সব শর্ত পূরণ হলে জাভাস্ক্রিপ্ট নিজে থেকে ফর্মের action-কে সাবমিট করবে
        const form = document.getElementById("purchase-form");
        if (form) {
            form.submit();
        }
    };


    // // পার্চেস/পেমেন্ট ফর্ম সাবমিট হ্যান্ডলার
    // const handlePurchaseSubmit = (e) => {
    //     if (!user) {
    //         e.preventDefault();
    //         toast.info("Please login to request delivery and pay!");
    //         router.push("/login");
    //         return;
    //     }

    //     if (user?.role !== "readers") {
    //         e.preventDefault();
    //         toast.error("Only users with 'readers' role can purchase books!");
    //         return;
    //     }
    // };

    // 🛠️ লিব্রারিয়ান একশন হ্যান্ডলারসমূহ 
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    const handleEditBook = () => {
        router.push(`/dashboard/librarian/edit-book/${id}`);
    };

    const handleDeleteBookConfirm = async () => {
        let token = null;
        try {
            const { data } = await authClient.token();
            if (data) token = data.token;
        } catch (err) {
            console.error(err);
        }

        if (!token) {
            toast.error("Authentication token missing!");
            return;
        }

        setDeleteLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/librarian/books/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                toast.success("Book deleted successfully! 🗑️");
                setIsModalOpen(false);
                router.push("/browse");
            } else {
                toast.error(responseData.message || "Failed to delete book.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while deleting!");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleUnpublishBook = async () => {
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

        try {
            const res = await fetch(`${baseUrl}/api/librarian/books/${id}/toggle-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: "Unpublished" })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Book unpublished successfully! 👁️‍🗨️");
                setBook(prev => ({ ...prev, status: 'Unpublished' }));
            } else {
                toast.error(data.message || "Failed to unpublish book.");
            }
        } catch (error) {
            console.error("Unpublish error:", error);
            toast.error("Failed to unpublish book.");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!user) {
            toast.error("Please login first to write a review!");
            router.push("/login");
            return;
        }

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

    if (loading || !id) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gray-950 text-white text-center py-20">
                <p className="mb-4 text-xl font-semibold text-rose-400">Book not found!</p>
                <p className="text-sm text-gray-500 mb-6">Requested ID: <span className="text-gray-300 font-mono bg-gray-900 px-2 py-1 rounded">{id}</span></p>
                <button onClick={() => router.back()} className="text-amber-400 font-bold hover:underline">Go Back</button>
            </div>
        );
    }

    // 🌟 BUSINESS LOGIC EVALUATION
    const status = book.status?.trim().toLowerCase();
    const isCheckedOut = status === "checked out";
    const isBookAvailable = status === "published" || status === "available";
    const isLibrarianOwner = user && user.role === "librarian" && book.librarianEmail === user.email;
    const isDeliveryDisabled = isCheckedOut || isLibrarianOwner;

    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 md:px-8 relative">
            <div className="max-w-6xl mx-auto space-y-12">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-amber-400 mb-4 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl">

                    <div className="lg:col-span-5 bg-gray-950 rounded-2xl p-8 flex items-center justify-center border border-gray-800/60 relative">
                        {/* 🛠️ ফিক্স ২: এক্সটার্নাল ইমেজ ক্র্যাশ এড়াতে স্ট্যান্ডার্ড img ব্যবহার করা হলো */}
                        <Image
                            src={book.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                            alt={book.title || "Book Cover"}
                            width={380}
                            height={380}
                            className="max-h-[380px] object-cover rounded-lg shadow-2xl"
                            loading="lazy"
                        />
                        <span className={`absolute top-4 right-4 text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg ${isBookAvailable ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                            {isCheckedOut ? "Checked Out" : book.status || "Unpublished"}
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

                        {/* 🛠️ LIBRARIAN CONTROLS SECTION */}
                        {isLibrarianOwner && (
                            <div className="bg-gray-950/60 border border-dashed border-amber-500/30 p-4 rounded-xl space-y-3">
                                <p className="text-xs font-bold text-amber-400 tracking-wider uppercase">Librarian Controls (You own this book)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <button onClick={handleEditBook} className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all">
                                        <Edit className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                    <button onClick={handleUnpublishBook} className="flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all">
                                        <EyeOff className="w-3.5 h-3.5" /> Unpublish
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 📢 READERS/PUBLIC ACTION SECTION */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
                                {!isLibrarianOwner && (
                                    <button
                                        type="button"
                                        onClick={handleWishlistClick}
                                        className={`flex-1 py-3.5 px-6 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition-all border ${isWishlisted
                                            ? "bg-rose-600 border-rose-600 text-white hover:bg-rose-700"
                                            : "bg-gray-950 border-gray-800 text-gray-300 hover:text-rose-400 hover:border-rose-500/40"
                                            }`}
                                    >
                                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
                                        {isWishlisted ? "Wishlisted" : "Wishlist"}
                                    </button>
                                )}

                                <div className="flex-[2] flex">
                                    {book?.isPurchased ? (
                                        <button
                                            type="button"
                                            disabled
                                            className="w-full py-3.5 px-6 bg-gray-800 text-gray-500 border border-gray-700/60 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            <ShieldCheck className="w-4 h-4" /> Already Requested / Paid
                                        </button>
                                    ) : isDeliveryDisabled ? (
                                        <button
                                            type="button"
                                            disabled
                                            className="w-full py-3.5 px-6 bg-gray-900 text-gray-600 border border-gray-800 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            {isCheckedOut ? "Unavailable (Checked Out)" : "Delivery Disabled (Owner)"}
                                        </button>
                                    ) : (
                                        <form action="/api/payments" method="POST" className="w-full">
                                            <input type="hidden" name="price" value={book.price || book.deliveryFee || 0} />
                                            <input type="hidden" name="status" value="pending" />
                                            <input type="hidden" name="bookId" value={book._id || ""} />
                                            <input type="hidden" name="title" value={book.title || ""} />
                                            <input type="hidden" name="userEmail" value={user?.email || ""} />
                                            <input type="hidden" name="userName" value={user?.name || ""} />
                                            <input type="hidden" name="userId" value={user?._id || ""} />
                                            <input type="hidden" name="librarianEmail" value={book?.librarianEmail || ""} />

                                            <button
                                                type="submit"
                                                className="w-full py-3.5 px-6 bg-amber-400 text-gray-900 hover:bg-amber-500 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/10"
                                            >
                                                <ShieldCheck className="w-4 h-4" /> Request Delivery & Pay
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* রিভিউ সেকশন */}
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

            {/* 🗑️ DELETE CONFIRMATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-500/10 rounded-full mb-4 border border-rose-500/20">
                            <Trash2 className="w-6 h-6 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-100 mb-2">Delete Book?</h3>
                        <p className="text-sm text-gray-400 mb-6">Are you sure you want to permanently delete <span className="text-gray-200 font-semibold">"{book.title}"</span>?</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 text-sm font-semibold text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700">Cancel</button>
                            <button onClick={handleDeleteBookConfirm} disabled={deleteLoading} className="flex-1 py-2 px-4 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700">{deleteLoading ? "Deleting..." : "Delete"}</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}