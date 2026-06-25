"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Calendar, BookOpen, User, CheckCircle2, Truck } from "lucide-react";
import { getLibrarianDeliveries, updateLibrarianDeliveryStatus } from "@/lib/action/payments";
import { authClient } from "@/lib/auth-client";

export default function ManageDeliveriesPage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const userEmail = user?.email || "";

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    // ডাটা লোড করার ফাংশন
    const loadDeliveries = async () => {
        if (!userEmail) return;

        try {
            setLoading(true);
            // 🟢 টোকেন ছাড়া শুধু ইমেইল পাঠানো হচ্ছে
            const data = await getLibrarianDeliveries({ userEmail });
            setDeliveries(data);
        } catch (error) {
            toast.error("Failed to load delivery logs");
        } finally {
            setLoading(false);
        }
    };

    // যখনই ইউজার ইমেইল পাওয়া যাবে, ডাটা ফেচ হবে
    useEffect(() => {
        if (userEmail) {
            loadDeliveries();
        }
    }, [userEmail]);

    // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার
    const handleStatusChange = async (id, currentStatus) => {
        let nextStatus = "";

        if (currentStatus === "Pending") nextStatus = "Dispatched";
        else if (currentStatus === "Dispatched") nextStatus = "Delivered";
        else return;

        if (!confirm(`Move status to '${nextStatus}'?`)) return;

        try {
            // 🟢 এখান থেকেও টোকেন বাদ দেওয়া হয়েছে
            const res = await updateLibrarianDeliveryStatus(id, nextStatus);
            if (res.success) {
                toast.success(res.message);
                loadDeliveries();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const getStatusStyle = (status) => {
        if (status === "Pending") return "bg-amber-400/10 text-amber-400 border-amber-400/20";
        if (status === "Dispatched") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        if (status === "Delivered") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    };

    if (isPending || loading || !userEmail) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-gray-950 min-h-screen text-gray-100 space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-400">
                    Manage Deliveries
                </h1>
                <p className="text-sm text-gray-400">
                    Review incoming client book requests, update states from Pending to Dispatched to Delivered.
                </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-950 border-b border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-400">
                                <th className="p-4 pl-6">Client Info</th>
                                <th className="p-4">Book Title</th>
                                <th className="p-4">Request Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60 text-sm">
                            {deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No delivery actions requested yet.
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-950/40 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-200">{item.clientName}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{item.clientEmail}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 font-medium text-gray-300 max-w-[200px] truncate">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-3.5 h-3.5 text-amber-400/70" />
                                                <span className="truncate">{item.bookTitle}</span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-gray-400 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-600" />
                                                {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className={`text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="p-4 pr-6 text-right">
                                            {item.status === "Pending" && (
                                                <button
                                                    onClick={() => handleStatusChange(item.id, "Pending")}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                                                >
                                                    <Truck className="w-3.5 h-3.5" /> Dispatch Book
                                                </button>
                                            )}

                                            {item.status === "Dispatched" && (
                                                <button
                                                    onClick={() => handleStatusChange(item.id, "Dispatched")}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete Delivery
                                                </button>
                                            )}

                                            {item.status === "Delivered" && (
                                                <span className="text-xs font-medium text-gray-500 inline-flex items-center gap-1 justify-end">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Done
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}