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

    // ⚡ স্ট্যাটাস পরিবর্তন হ্যান্ডলার
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

        try {
            setUpdatingId(id);
            const result = await updateLibrarianDeliveryStatus(id, newStatus, token);

            if (result.success) {
                toast.success(result.message || `Status updated to ${newStatus}! 🎉`);
                await loadDeliveries();
            } else {
                toast.error(result.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Something went wrong during status update.");
        } finally {
            setUpdatingId(null);
        }
    };

    // 🎨 ইমেজের মতো স্ট্যাটাস ব্যাজ কালার হেল্পার
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 text-xs font-medium rounded-full";
            case "dispatched":
                return "bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 text-xs font-medium rounded-full";
            case "delivered":
                return "bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 text-xs font-medium rounded-full";
            default:
                return "bg-gray-50 text-gray-500 border border-gray-100 px-3 py-1 text-xs font-medium rounded-full";
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
        <div className="container mx-auto p-6 max-w-7xl font-sans">
            {/* Header Title Section - Exactly like image */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Manage Deliveries</h1>
                <p className="text-sm text-gray-500 mt-1">Update delivery status for your book requests.</p>
            </div>

            {/* List Table Section */}
            {deliveries.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                    <p className="text-gray-400 text-sm">No delivery requests found.</p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
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

                                    {/* Actions Column - Exactly as described */}
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
            )}
        </div>
    );
};