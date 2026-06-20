'use client';
import { authClient } from '@/lib/auth-client';
import { BookOpen, CircleCheck } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { DollarSign, LayoutDashboard, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const DashboardSidebar = () => {
    // Better Auth ক্লায়েন্ট থেকে ডাইনামিক সেশন ও ইউজার ডাটা নেওয়া
    const { data: session } = authClient.useSession();
    const user = session?.user;
    return (
        <div>
            <h1>   <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col gap-8 shrink-0">

                {/* এডমিন প্রোফাইল এরিয়া (রিয়েল সেশন ডাটা) */}
                <div className="flex flex-col items-center text-center gap-2 border-b border-slate-50 pb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative">
                        <Image
                            src={user?.image || "/avatar-placeholder.png"} // ডাইনামিক প্রোফাইল পিকচার
                            alt="Admin Profile"
                            width={80}
                            height={80}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{user?.name || "Admin"}</h3>
                        <p className="text-xs text-slate-400 font-medium">{user?.email || "admin@gmail.com"}</p>
                        <span className="mt-2 inline-block px-3 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                            {user?.role || "Admin"}
                        </span>
                    </div>
                </div>

                {/* নেভিগেশন লিংকসমূহ */}
                <nav className="flex flex-col gap-2">
                    <Button className="justify-start gap-3 px-4 py-6 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl" variant="light">
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" /> Overview
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <CircleCheck className="text-lg text-slate-400" /> Book Approvals
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <Users className="w-5 h-5 text-slate-400" /> Manage Users
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <BookOpen className="w-5 h-5 text-slate-400" /> Manage Books
                    </Button>
                    <Button className="justify-start gap-3 px-4 py-6 text-slate-500 hover:text-slate-900 font-medium text-sm rounded-xl" variant="light">
                        <DollarSign className="w-5 h-5 text-slate-400" /> Transactions
                    </Button>
                </nav>
            </aside></h1>
        </div>
    );
};

export default DashboardSidebar;