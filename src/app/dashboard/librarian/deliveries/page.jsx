"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { updateLibrarianDeliveryStatus } from "@/lib/action/payments";
import { authClient } from "@/lib/auth-client";

export default function ManageDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    // Better-Auth থেকে ইউজার সেশন নেওয়া হচ্ছে
    const { data: session, isPending: authLoading } = authClient.useSession();
    const userEmail = session?.user?.email;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const loadDeliveries = useCallback(async () => {
        if (!userEmail) return;

        let token = null;
        try {
            const { data } = await authClient.token();
            if (data) token = data.token;
        } catch (err) {
            console.error("Failed to fetch token:", err);
        }

        if (!token) {
            toast.error("Authentication token missing!");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/librarian/deliveries?email=${userEmail}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to fetch data from server");

            const result = await res.json();

            if (result.success) {
                const rawList = result.data || result.deliveries || [];
                const cleanList = rawList.map(order => {
                    const orderId = order.id || order._id?.toString() || order._id;
                    return {
                        ...order,
                        id: typeof orderId === 'object' ? orderId['$oid'] || JSON.stringify(orderId) : orderId,
                        status: order.status ? order.status.toLowerCase() : "pending"
                    };
                });
                setDeliveries(cleanList);
            } else {
                setDeliveries([]);
            }
        } catch (error) {
            console.error("Fetch deliveries error:", error);
            toast.error("Failed to load delivery logs");
        } finally {
            setLoading(false);
        }
    }, [userEmail, API_URL]);

    useEffect(() => {
        if (userEmail) {
            loadDeliveries();
        } else if (!authLoading && !userEmail) {
            setLoading(false);
        }
    }, [userEmail, authLoading, loadDeliveries]);

    // ⚡ স্ট্যাটাস পরিবর্তন হ্যান্ডলার (React Hot Toast Promise Integration)
    const handleStatusChange = async (id, newStatus) => {
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

        // টোস্ট প্রমিজ প্রিপেয়ার করা
        const updatePromise = new Promise(async (resolve, reject) => {
            try {
                setUpdatingId(id);
                const result = await updateLibrarianDeliveryStatus(id, newStatus, token);

                if (result.success) {
                    await loadDeliveries(); // টেবিল ডাটা রিফ্রেশ করা
                    resolve(result.message || `Status successfully updated to ${newStatus}!`);
                } else {
                    reject(new Error(result.message || "Failed to update status."));
                }
            } catch (error) {
                reject(error);
            } finally {
                setUpdatingId(null);
            }
        });

        // টোস্ট মেসেজ রান করানো
        toast.promise(updatePromise, {
            loading: `Updating status to ${newStatus}... ⏳`,
            success: (msg) => `${msg} 🎉`,
            error: (err) => `${err.message || "Something went wrong!"} ❌`
        });
    };

    // 🎨 ইমেজের মতো স্ট্যাটাস ব্যাজ কালার হেল্পার
    const getStatusBadgeClass = (status) => {
        const baseClass = "px-3 py-1 text-xs font-medium rounded-full inline-block w-fit text-center";
        switch (status?.toLowerCase()) {
            case "pending":
                return `${baseClass} bg-amber-50 text-amber-600 border border-amber-100`;
            case "dispatched":
                return `${baseClass} bg-blue-50 text-blue-600 border border-blue-100`;
            case "delivered":
                return `${baseClass} bg-emerald-50 text-emerald-600 border border-emerald-100`;
            default:
                return `${baseClass} bg-gray-50 text-gray-500 border border-gray-100`;
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-500 text-sm font-medium">Loading requests...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl font-sans">
            {/* Header Title Section */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">Manage Deliveries</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Update delivery status for your book requests.</p>
            </div>

            {/* List Table / Card Section */}
            {deliveries.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 sm:p-16 text-center">
                    <p className="text-gray-400 text-sm">No delivery requests found.</p>
                </div>
            ) : (
                <>
                    {/* 📱 Mobile & Tablet View (Cards Layout) - Visible below 'md' break point */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                        {deliveries.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">
                                                {order.userName || "Unknown Client"}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {order.userEmail || "No Email"}
                                            </div>
                                        </div>
                                        <span className={getStatusBadgeClass(order.status)}>
                                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                                        </span>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Book</span>
                                        <div className="font-medium text-gray-800 text-sm line-clamp-2">
                                            {order.bookTitle}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Date</span>
                                        <div className="text-gray-600 text-xs">
                                            {order.date || order.createdAt ? new Date(order.date || order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            }) : "N/A"}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions button at bottom of card */}
                                <div className="pt-2 border-t border-gray-50 flex justify-end">
                                    {(order.status === "pending" || !order.status) && (
                                        <button
                                            disabled={updatingId === order.id}
                                            onClick={() => handleStatusChange(order.id, "Dispatched")}
                                            className="w-full px-4 py-2.5 text-xs font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {updatingId === order.id ? "Processing..." : "Mark Dispatched"}
                                        </button>
                                    )}

                                    {order.status === "dispatched" && (
                                        <button
                                            disabled={updatingId === order.id}
                                            onClick={() => handleStatusChange(order.id, "Delivered")}
                                            className="w-full px-4 py-2.5 text-xs font-semibold bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {updatingId === order.id ? "Processing..." : "Mark Delivered"}
                                        </button>
                                    )}

                                    {order.status === "delivered" && (
                                        <div className="flex items-center justify-center gap-1.5 text-gray-500 font-medium text-xs py-2 w-full bg-gray-50 rounded-lg">
                                            <span className="text-emerald-500">✔</span> Complete
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 💻 Desktop View (Table Layout) - Hidden below 'md' break point */}
                    <div className="hidden md:block w-full overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-wider px-4">
                                    <th className="pb-2 pl-6 w-[25%]">Client</th>
                                    <th className="pb-2 w-[30%]">Book</th>
                                    <th className="pb-2 w-[15%]">Date</th>
                                    <th className="pb-2 w-[15%]">Status</th>
                                    <th className="pb-2 pr-6 w-[15%] text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-50 hover:bg-gray-50/50 transition-all duration-150"
                                    >
                                        {/* Client Column */}
                                        <td className="py-5 pl-6 rounded-l-xl">
                                            <div className="font-semibold text-gray-800 text-[14px]">
                                                {order.userName || "Unknown Client"}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {order.userEmail || "No Email"}
                                            </div>
                                        </td>

                                        {/* Book Title Column */}
                                        <td className="py-5 pr-4">
                                            <div className="font-medium text-gray-800 text-[14px] line-clamp-1">
                                                {order.bookTitle}
                                            </div>
                                        </td>

                                        {/* Date Column */}
                                        <td className="py-5 text-gray-600 text-[14px]">
                                            {order.date || order.createdAt ? new Date(order.date || order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            }) : "N/A"}
                                        </td>

                                        {/* Status Column */}
                                        <td className="py-5">
                                            <span className={getStatusBadgeClass(order.status)}>
                                                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                                            </span>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="py-5 pr-6 rounded-r-xl">
                                            {(order.status === "pending" || !order.status) && (
                                                <button
                                                    disabled={updatingId === order.id}
                                                    onClick={() => handleStatusChange(order.id, "Dispatched")}
                                                    className="px-4 py-2 text-xs font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg shadow-md shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {updatingId === order.id ? "Processing..." : "Mark Dispatched"}
                                                </button>
                                            )}

                                            {order.status === "dispatched" && (
                                                <button
                                                    disabled={updatingId === order.id}
                                                    onClick={() => handleStatusChange(order.id, "Delivered")}
                                                    className="px-4 py-2 text-xs font-semibold bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg shadow-md shadow-sky-100 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {updatingId === order.id ? "Processing..." : "Mark Delivered"}
                                                </button>
                                            )}

                                            {order.status === "delivered" && (
                                                <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm pl-1">
                                                    <span className="text-emerald-500">✔</span> Complete
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}