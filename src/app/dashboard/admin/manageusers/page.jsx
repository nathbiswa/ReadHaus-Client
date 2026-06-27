"use client";
import { useState, useEffect } from "react";
import { Trash2, Search, SlidersHorizontal, ChevronDown, UserCheck, Loader2, Calendar, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { adminService } from "@/lib/core/server";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 🚀 Fetch users from database
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data || []);
        } catch (error) {
            toast.error("Failed to load users!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🎯 Role Change Handler
    const handleRoleChange = async (id, newRole) => {
        try {
            await adminService.updateUserRole(id, newRole);
            setUsers(prev => prev.map(user => user._id === id ? { ...user, role: newRole } : user));
            toast.success("User role updated successfully!");
        } catch (error) {
            toast.error("Failed to update role.");
        }
    };

    // 🎯 Delete User Handler
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user permanently?")) return;

        try {
            await adminService.deleteUser(id);
            setUsers(prev => prev.filter(user => user._id !== id));
            toast.success("User deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete user.");
        }
    };

    // 🔍 Helper: Role Styling
    const getRoleClass = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'border-indigo-200 text-indigo-700 bg-indigo-50/50';
            case 'librarian': return 'border-purple-200 text-purple-700 bg-purple-50/50';
            default: return 'border-slate-200 text-slate-700 bg-slate-50/50';
        }
    };

    // 🔍 Search Filter
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen w-full max-w-7xl mx-auto">

            {/* Header + Search/Filter Controls */}
            <div className="mb-6 md:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Manage Users</h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5">View, filter, and modify control roles for platform users.</p>
                </div>

                {/* Search Inputs */}
                <div className="flex items-center gap-2.5 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 lg:py-2 bg-white border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-full lg:w-64 transition-colors shadow-sm"
                        />
                    </div>
                    <button className="p-2.5 lg:p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Container */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-center py-20 w-full">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-100 shadow-sm text-sm font-medium">
                    No matching users found.
                </div>
            ) : (
                <>
                    {/* ==================== ১. মোবাইল ভিউ (Mobile Responsive Cards) ==================== */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredUsers.map((user) => {
                            const isAdmin = user.role?.toLowerCase() === 'admin';
                            return (
                                <div key={user._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base shrink-0">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-800 text-sm truncate">{user.name}</h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                                <Mail size={12} /> {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100" />

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={13} />
                                            <span>
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Action: Delete Trigger */}
                                        {!isAdmin && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl transition"
                                                aria-label="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Role Selection Container */}
                                    <div className="pt-1">
                                        {isAdmin ? (
                                            <div className="w-full py-2 border border-indigo-200 text-indigo-700 bg-indigo-50/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                                                <UserCheck className="w-4 h-4" /> Administrator Role
                                            </div>
                                        ) : (
                                            <div className="relative w-full">
                                                <Shield className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className={`appearance-none w-full pl-9 pr-8 py-2 border rounded-xl text-xs font-semibold focus:outline-none cursor-pointer shadow-sm transition-all ${getRoleClass(user.role)}`}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Librarian">Librarian</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ==================== ২. ডেস্কটপ ভিউ (Large Screen Layout) ==================== */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                        <th className="p-4 pl-6">User</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Joined</th>
                                        <th className="p-4 pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map((user) => {
                                        const isAdmin = user.role?.toLowerCase() === 'admin';
                                        return (
                                            <tr key={user._id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                                <td className="p-4 pl-6 max-w-[200px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm shrink-0">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-slate-800 text-sm truncate">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600 text-sm max-w-[240px] truncate">{user.email}</td>
                                                <td className="p-4">
                                                    {isAdmin ? (
                                                        <span className="px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50/40 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
                                                            <UserCheck className="w-3.5 h-3.5" /> Admin
                                                        </span>
                                                    ) : (
                                                        <div className="relative inline-block text-left">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
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
                                                <td className="p-4 text-slate-500 text-sm">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="p-4 pr-6 text-right">
                                                    {!isAdmin && (
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="p-2 text-rose-600 bg-rose-50/50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
                                                            title="Delete Permanently"
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
                </>
            )}
        </div>
    );
};

export default ManageUsers;