'use client';

import { authClient } from '@/lib/auth-client';
import { Bars, Bell, BookOpen, CircleCheck, Magnifier } from '@gravity-ui/icons';
import { Button, Drawer } from '@heroui/react';
// Lucide-react থেকে প্রয়োজনীয় আইকন এবং নতুন কিছু দরকারি আইকন আনা হয়েছে
import { LayoutDashboard, Users, User, DollarSign, House, FilePlus, Boxes, Truck, History, ListCheck, MessageSquare, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 👈 একটিভ পেইজ ট্র্যাক করার জন্য
import React from 'react';

const DashboardSidebar = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const pathname = usePathname(); // 👈 কারেন্ট ইউআরএল পাথ নেওয়ার জন্য

    // 🚀 প্রতিটি রোলের জন্য আলাদা ও মানানসই আইকন সেট করা হয়েছে
    const dashboardItems = {
        admin: [
            { icon: LayoutDashboard, label: "Overview", link: "/dashboard/admin/overview" },
            { icon: CircleCheck, label: "Book Approvals", link: "/dashboard/admin/approvals" },
            { icon: Users, label: "Manage Users", link: '/dashboard/admin/manageusers' }, // Users আইকন
            { icon: BookOpen, label: "Manage Books", link: '/dashboard/admin/managebooks' },
            { icon: DollarSign, label: "Transactions", link: '/dashboard/admin/transactions' },
        ],
        readers: [
            { icon: LayoutDashboard, label: "Overview", link: "/dashboard/readers/overview" },
            { icon: History, label: "Delivery History", link: '/dashboard/readers/deliveryhistory' }, // History আইকন
            { icon: ListCheck, label: "Reading List", link: '/dashboard/readers/readinglist' }, // ListCheck আইকন
            { icon: MessageSquare, label: "My Reviews", link: '/dashboard/readers/reviews' }, // Message আইকন
            { icon: Heart, label: "Wish List", link: '/dashboard/readers/wishlist' }, // Heart আইকন
        ],
        librarian: [
            { icon: House, label: "Overview", link: "/dashboard/librarian/overview" },
            { icon: FilePlus, label: "Add Book", link: "/dashboard/librarian/addbook" }, // FilePlus আইকন
            { icon: Boxes, label: "Manage Inventory", link: "/dashboard/librarian/inventory" }, // Boxes আইকন
            { icon: Truck, label: "Manage Deliveries", link: "/dashboard/librarian/deliveries" }, // Truck আইকন
        ]
    };

    const navItems = user?.role ? dashboardItems[user.role] : [];

    return (
        <div className="min-h-screen">
            <Drawer>
                <Button variant="secondary" className='block md:hidden'>
                    <Bars />
                    Menu
                </Button>
                <nav className="flex flex-col gap-1 w-[350px] h-[1000px] border-r-2 border-slate-200 p-4">

                    <div className="flex flex-col items-center text-center gap-2 border-b border-slate-100 pb-6 mb-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative">
                            <Image
                                src={user?.image || "/avatar-placeholder.png"}
                                alt="Profile Picture"
                                width={80}
                                height={80}
                                className="object-cover"
                                style={{ width: "auto", height: "auto" }}
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

                    {/* 🚀 মেইন ডেক্সটপ নেভিগেশন (অ্যাক্টিভ ব্যাকগ্রাউন্ড সহ) */}
                    {navItems?.map((item) => {
                        const isActive = pathname === item.link; // চেক করা হচ্ছে এই বাটনটি একটিভ কিনা
                        return (
                            <Link key={item.label} href={item.link || "#"}>
                                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 w-full cursor-pointer ${isActive
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm" // 👈 একটিভ বাটনের ব্যাকগ্রাউন্ড ও কালার
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    <item.icon className={`size-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {/* 🚀 মোবাইল ড্রয়ার নেভিগেশন (অ্যাক্টিভ ব্যাকগ্রাউন্ড সহ) */}
                                {navItems?.map((item) => {
                                    const isActive = pathname === item.link;
                                    return (
                                        <Link key={`drawer-${item.label}`} href={item.link || "#"}>
                                            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 w-full cursor-pointer ${isActive
                                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                            >
                                                <item.icon className={`size-5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                                                <span>{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </div>
    );
};

export default DashboardSidebar;