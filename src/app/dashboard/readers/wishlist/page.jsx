'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react"; // ডিলিট ট্র্যাশ আইকনের জন্য
import Image from "next/image";
import Link from "next/link";

const Wishlist = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ব্যাকএন্ড থেকে ইউজারের উইশলিস্ট ডেটা ফেচ করা
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                const res = await fetch(`${baseUrl}/api/user-wishlist?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setWishlistItems(data.data);
                } else {
                    toast.error(data.message || "Failed to load wishlist.");
                }
            } catch (error) {
                console.error("Wishlist fetch error:", error);
                toast.error("Network error! Could not load wishlist.");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user?.email]);

    // ২. উইশলিস্ট থেকে বই রিমুভ করার হ্যান্ডলার
    const handleRemoveFromWishlist = async (itemId) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/wishlist/${itemId}`, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Removed from wishlist!");
                setWishlistItems(wishlistItems.filter(item => item._id !== itemId && item.id !== itemId));
            } else {
                toast.error(data.message || "Could not remove item.");
            }
        } catch (error) {
            toast.error("Failed to remove item due to network issue.");
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500 font-medium min-h-screen bg-gray-50/50">
                Loading your wishlist...
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                <p className="text-gray-500 mt-1">Books you've saved for later.</p>
            </div>

            {/* Wishlist Grid */}
            {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                    Your wishlist is empty.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id || item._id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md"
                        >
                            {/* Book Image Cover */}
                            <div className="w-full h-48 relative bg-slate-100">
                                <Image
                                    src={item.bookImage || item.image || "/book-placeholder.png"}
                                    alt={item.bookTitle || "Book Cover"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-w-700px) 100vw, 25vw"
                                />
                            </div>

                            {/* Book Details */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bold text-slate-800 text-base line-clamp-1 mb-0.5">
                                    {item.bookTitle || "The Silent Patient"}
                                </h3>
                                <p className="text-xs text-gray-400 font-medium mb-4">
                                    {item.author || "Alex Michaelides"}
                                </p>

                                {/* Price and Action Buttons Container */}
                                <div className="flex items-center justify-between mt-auto pt-2">
                                    {/* Price tag */}
                                    <span className="font-bold text-amber-600 text-base">
                                        ${Number(item.price || 4.50).toFixed(2)}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {/* View Button */}
                                        <Link href={`/books/${item.bookId || item.id || '#'} `}>
                                            <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-100 transition-colors duration-200">
                                                View
                                            </button>
                                        </Link>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleRemoveFromWishlist(item.id || item._id)}
                                            className="p-1.5 text-rose-500 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-xl transition-colors duration-200"
                                            title="Remove from Wishlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;