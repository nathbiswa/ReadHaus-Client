"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const EditBookPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    // 🔑 Better-Auth এর সেশন ডাটা
    const { data: session, isPending } = authClient.useSession();

    const [loading, setLoading] = useState(false);
    const [bookData, setBookData] = useState({
        title: "", author: "", description: "", category: "", deliveryFee: "", image: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let token = null;

        try {
            const { data, error } = await authClient.token();
            if (data) {
                token = data.token;
                console.log("Token going to server:", token);
            }
        } catch (err) {
            console.error("Failed to fetch client token:", err);
        }

        if (!token) {
            toast.error("Authentication token missing! Please login again.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${baseUrl}/api/librarian/books/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            });

            const responseData = await res.json();

            if (res.ok && responseData.success) {
                toast.success("Book updated successfully! 🎉");

                // 🔑 এখানে ফর্মের সব ইনপুট ফিল্ড রিসেট (খালি) করা হলো
                setBookData({
                    title: "",
                    author: "",
                    description: "",
                    category: "",
                    deliveryFee: "",
                    image: ""
                });

                // আপনার রাউট অনুযায়ী রিডাইরেক্ট
                router.push(`/dashboard/librarian/edit-book/${id}`);
            } else {
                toast.error(responseData.message || "Failed to update book.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Something went wrong with the server connection!");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) return <p className="text-center my-10">Loading auth state...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Book Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Book Title</label>
                    <input type="text" name="title" value={bookData.title} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Author Name</label>
                    <input type="text" name="author" value={bookData.author} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input type="text" name="category" value={bookData.category} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Fee ($)</label>
                    <input type="number" name="deliveryFee" value={bookData.deliveryFee} onChange={handleChange} required className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="image" value={bookData.image} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={bookData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded mt-1"></textarea>
                </div>

                <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBookPage;