'use client';
import { useState } from "react";
import { Search, ChevronDown, CheckCircle2, Truck, Clock } from "lucide-react";

const ManageDeliveries = () => {
    // 💡 পরবর্তীতে ডেটাবেজ থেকে ডেটা এনে এই স্টেটটি রিপ্লেস করলেই সব ডাইনামিক হয়ে যাবে
    const [deliveries, setDeliveries] = useState([
        {
            id: "1",
            clientName: "Dominique Shepard",
            clientEmail: "duhecuhix@mailinator.com",
            bookTitle: "Quia sunt eum incidu",
            date: "Jun 15, 2026",
            status: "Delivered"
        },
        {
            id: "2",
            clientName: "Alex Morgan",
            clientEmail: "alex.m@example.com",
            bookTitle: "Project Hail Mary",
            date: "Jun 18, 2026",
            status: "Dispatched"
        },
        {
            id: "3",
            clientName: "Jane Doe",
            clientEmail: "jane.doe@example.com",
            bookTitle: "The Silent Patient",
            date: "Jun 20, 2026",
            status: "Pending"
        }
    ]);

    // স্ট্যাটাস পরিবর্তনের হ্যান্ডলার (আপাতত ফ্রন্টএন্ডে স্টেট আপডেট দেখাবে)
    const handleStatusChange = (id, newStatus) => {
        setDeliveries(prev =>
            prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
        );
    };

    // স্ট্যাটাস অনুযায়ী ব্যাজ কালার এবং আইকন জেনারেট করার ফাংশন
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            case 'dispatched':
                return 'bg-blue-50 text-blue-700 border border-blue-100';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Deliveries</h1>
                    <p className="text-slate-500 mt-1">Update delivery status for your book requests.</p>
                </div>

                {/* Search Filter */}
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by client or book..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* 🚀 মডার্ন ডেলিভারি টেবিল */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Client</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Book</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {deliveries.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                    {/* Client Details */}
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800 text-sm">{item.clientName}</span>
                                            <span className="text-xs text-slate-400">{item.clientEmail}</span>
                                        </div>
                                    </td>

                                    {/* Book Title */}
                                    <td className="p-4 font-medium text-slate-700 break-words max-w-[200px]">
                                        {item.bookTitle}
                                    </td>

                                    {/* Request Date */}
                                    <td className="p-4 text-slate-600 text-sm">
                                        {item.date}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${getStatusStyles(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Actions: Update Status Dropdown */}
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.status === "Delivered" ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 select-none">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Complete
                                                </div>
                                            ) : (
                                                <div className="relative inline-block text-left">
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                        className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer shadow-sm transition-colors"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Dispatched">Dispatched</option>
                                                        <option value="Delivered">Delivered</option>
                                                    </select>
                                                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDeliveries;