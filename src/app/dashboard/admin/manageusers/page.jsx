'use client';
import { useState } from "react";
import { Trash2, Search, SlidersHorizontal, ChevronDown, UserCheck } from "lucide-react";

const ManageUsers = () => {
    // 💡 পরবর্তীতে ডেটাবেজ থেকে এপিআই-এর মাধ্যমে ডাটা এনে এই স্টেটটি রিপ্লেস করলেই সব ডাইনামিক হয়ে যাবে
    const [users, setUsers] = useState([
        {
            id: "1",
            name: "Derek Peters",
            email: "a@b.com",
            role: "User",
            joinedDate: "Jun 15, 2026"
        },
        {
            id: "2",
            name: "James Rodriguez",
            email: "james@heritagebooks.com",
            role: "Librarian",
            joinedDate: "Jun 9, 2026"
        },
        {
            id: "3",
            name: "Admin",
            email: "admin@gmail.com",
            role: "Admin",
            joinedDate: "Jun 9, 2026"
        },
        {
            id: "4",
            name: "Dominique Shepard",
            email: "duhecuhix@mailinator.com",
            role: "User",
            joinedDate: "Jun 9, 2026"
        }
    ]);

    // রোলের ওপর ভিত্তি করে ব্যাজ বা বর্ডার কালার দেওয়ার ফাংশন
    const getRoleClass = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'border-indigo-200 text-indigo-700 bg-indigo-50/30';
            case 'librarian':
                return 'border-purple-200 text-purple-700 bg-purple-50/30';
            default:
                return 'border-slate-200 text-slate-700 bg-slate-50/30';
        }
    };

    // রোল চেঞ্জ করার হ্যান্ডলার (আপাতত ফ্রন্টএন্ড স্টেট আপডেট করবে)
    const handleRoleChange = (id, newRole) => {
        setUsers(prev =>
            prev.map(user => user.id === id ? { ...user, role: newRole } : user)
        );
    };

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Users</h1>
                    <p className="text-slate-500 mt-1">View and manage all platform users.</p>
                </div>

                {/* Search & Filter bar */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-colors shadow-sm"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm" title="Filters">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 🚀 মডার্ন ইউজার টেবিল কন্টেইনার */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => {
                                const isAdmin = user.role?.toLowerCase() === 'admin';
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                        {/* User Profiling */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-slate-800 text-sm">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="p-4 text-slate-600 text-sm">
                                            {user.email}
                                        </td>

                                        {/* Role Select Dropdown */}
                                        <td className="p-4">
                                            {isAdmin ? (
                                                <span className="px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50/40 rounded-xl text-xs font-bold inline-flex items-center gap-1">
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <div className="relative inline-block text-left">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className={`appearance-none pl-3 pr-8 py-1.5 border rounded-xl text-xs font-semibold focus:outline-none cursor-pointer shadow-sm transition-all ${getRoleClass(user.role)}`}
                                                    >
                                                        <option value="User">User</option>
                                                        <option value="Librarian">Librarian</option>
                                                        <option value="Admin">Admin</option>
                                                    </select>
                                                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Joined Date */}
                                        <td className="p-4 text-slate-500 text-sm">
                                            {user.joinedDate}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-right pr-6">
                                            {!isAdmin && (
                                                <button
                                                    className="p-2 text-rose-600 bg-rose-50/50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;