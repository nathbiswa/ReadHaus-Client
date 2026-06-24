'use client';
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const DeliveryHistory = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryHistory = async () => {
            if (!user?.email) return;

            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                // ব্যাকঅ্যান্ড থেকে ইউজারের ইমেইল অনুযায়ী ডেলিভারি হিস্ট্রি ফেচ করা
                const res = await fetch(`${baseUrl}/api/user-deliveries?email=${user.email}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setDeliveries(data.data);
                } else {
                    toast.error(data.message || "Failed to load delivery history.");
                }
            } catch (error) {
                console.error("Delivery fetch error:", error);
                toast.error("Network error! Could not load deliveries.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryHistory();
    }, [user?.email]);

    // স্ট্যাটাসের ওপর ভিত্তি করে ডাইনামিক কালার ব্যাজ জেনারেট করার ফাংশন
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'complete':
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'shipped':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50 text-gray-500 font-medium p-4">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading delivery history...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50/50 md:min-h-screen">
            {/* Header section */}
            <div className="mb-6 md:mb-8 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Delivery History</h1>
                <p className="text-sm text-gray-500 mt-1">Track all your book delivery requests.</p>
            </div>

            {/* ১. মোবাইল রেসপনসিভ কার্ড ভিউ (শুধুমাত্র ছোট স্ক্রিনের জন্য) */}
            <div className="block md:hidden space-y-4">
                {deliveries.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
                        No delivery requests found.
                    </div>
                ) : (
                    deliveries.map((delivery) => (
                        <div key={delivery._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-slate-800 text-base break-words max-w-[70%]">
                                    {delivery.bookTitle}
                                </h3>
                                <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full capitalize shrink-0 ${getStatusStyles(delivery.status)}`}>
                                    {delivery.status || "Pending"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-xs">
                                <div>
                                    <p className="text-gray-400 uppercase tracking-wider text-[10px]">Price / Fee</p>
                                    <p className="font-bold text-emerald-600 mt-0.5">${Number(delivery.price || 0).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase tracking-wider text-[10px]">Request Date</p>
                                    <p className="font-medium text-slate-600 mt-0.5">
                                        {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        }) : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-50">
                                <p className="text-gray-400 uppercase tracking-wider text-[10px]">Session / Transaction ID</p>
                                <p className="font-mono text-slate-500 text-xs mt-0.5 break-all bg-slate-50 p-2 rounded select-all">
                                    {delivery.sessionId || "N/A"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ২. ডেস্কটপ টেবিল ভিউ (মাঝারি ও বড় স্ক্রিনের জন্য) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/4">Book Title</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Price / Fee</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Request Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Session / Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">
                                        No delivery requests found.
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((delivery) => (
                                    <tr key={delivery._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-semibold text-slate-800 break-words max-w-[200px]">
                                            {delivery.bookTitle}
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">
                                            ${Number(delivery.price || 0).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusStyles(delivery.status)}`}>
                                                {delivery.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-slate-500 max-w-[180px] truncate select-all" title={delivery.sessionId}>
                                            {delivery.sessionId || "N/A"}
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
};

export default DeliveryHistory;