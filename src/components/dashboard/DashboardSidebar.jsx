'use client';

import { authClient } from '@/lib/auth-client';
import { Bars, Bell, BookOpen, CircleCheck, Magnifier } from '@gravity-ui/icons';
import { Button, Drawer } from '@heroui/react';
import { DollarSign, House, LayoutDashboard, Users, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // 👈 lucide-react এর বদলে Next.js এর আসল Link ইমপোর্ট করা হয়েছে
import React from 'react';

const DashboardSidebar = () => {
    // Better Auth ক্লায়েন্ট থেকে ডাইনামিক সেশন ও ইউজার ডাটা নেওয়া
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const dashboardItems = {
        admin: [
            { icon: LayoutDashboard, label: "Overview", link: "/dashboard/admin/overview" },
            { icon: CircleCheck, label: "Book Approvals", link: "/dashboard/admin/approvals" },
            { icon: User, label: "Manage Users", link: '/dashboard/admin/manageusers' },
            { icon: BookOpen, label: "Manage Books", link: '/dashboard/admin/managebooks' },
            { icon: DollarSign, label: "Transactions", link: '/dashboard/admin/transactions' },
        ],
        readers: [
            { icon: LayoutDashboard, label: "Overview", link: "/dashboard/readers/overview" },
            { icon: Magnifier, label: "Delivery History", link: '/dashboard/readers/deliveryhistory' },
            { icon: Magnifier, label: "Reading List", link: '/dashboard/readers/readinglist' },
            { icon: Magnifier, label: "My Reviews", link: '/dashboard/readers/reviews' },
            { icon: Magnifier, label: "Wish List", link: '/dashboard/readers/wishlist' },
        ],
        librarian: [
            { icon: House, label: "Overview", link: "/dashboard/librarian/overview" },
            { icon: Magnifier, label: "Add Book", link: "/dashboard/librarian/addbook" },
            { icon: Bell, label: "Manage Inventory", link: "/dashboard/librarian/inventory" },
            { icon: Bell, label: "Manage Deliveries", link: "/dashboard/librarian/deliveries" },
        ]
    };

    // ইউজার রোল অনুযায়ী আইটেম নেওয়া, ডাটা না থাকলে বা লোড হতে সময় নিলে ব্যাকআপ হিসেবে খালি অ্যারে [] দেওয়া হয়েছে
    const navItems = user?.role ? dashboardItems[user.role] : [];

    return (
        <div className="min-h-screen">
            <Drawer>
                <Button variant="secondary" className='block md:hidden'>
                    <Bars />
                    Menu
                </Button>
                <nav className="flex flex-col gap-1 w-[350px] h-[1000px] border border-right-2">

                    <div className="flex flex-col items-center text-center gap-2 border-b border-slate-50 pb-6">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative">
                            <Image
                                src={user?.image || "/avatar-placeholder.png"}
                                alt="Profile Picture"
                                width={80}
                                height={80}
                                className="object-cover"
                                style={{ width: "auto", height: "auto" }} // 👈 অ্যাসপেক্ট রেশিও ঠিক রাখার জন্য
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{user?.name || "Loading..."}</h3>
                            <p className="text-xs text-slate-400 font-medium">{user?.email || "please wait..."}</p>
                            <span className="mt-2 inline-block px-3 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                                {user?.role || "Guest"}
                            </span>
                        </div>
                    </div>

                    {/* 🚀 এখানে Optional Chaining (?.) ব্যবহার করা হয়েছে যেন ডাটা না আসলেও ক্র্যাশ না করে */}
                    {navItems?.map((item) => (
                        <Link key={item.label} href={item.link || "#"}>
                            <div className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default w-full cursor-pointer">
                                <item.icon className="size-5 text-muted" />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {/* 🚀 মোবাইল ড্রয়ারের ভেতরের ম্যাপ লজিকও সেফ করা হয়েছে */}
                                {navItems?.map((item) => (
                                    <Link key={`drawer-${item.label}`} href={item.link || "#"}>
                                        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default w-full cursor-pointer">
                                            <item.icon className="size-5 text-muted" />
                                            <span>{item.label}</span>
                                        </div>
                                    </Link>
                                ))}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </div>
    );
};

export default DashboardSidebar;