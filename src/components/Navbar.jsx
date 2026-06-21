"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi"; // থিম আইকন

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // থিম স্টেট
    const router = useRouter();
    const pathname = usePathname();

    // authClient hook থেকে সেশন এবং ইউজার ডেটা লোড
    const { data: session } = authClient.useSession();
    const user = session?.user;

    // ব্রাউজার লোড হওয়ার সময় আগের সেভ করা থিম চেক করা
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    // থিম টগল করার ফাংশন
    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    // ড্যাশবোর্ড পেজগুলোতে নেভবার হাইড রাখার লজিক
    // if (pathname.includes("dashboard")) {
    //     return null;
    // }

    // সাইন আউট হ্যান্ডলার এবং রিডাইরেকশন
    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            setIsMenuOpen(false);
            router.push("/login");
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    // একটিভ রুট হাইলাইট করার হেল্পার ফাংশন
    const navClass = (path) =>
        pathname === path
            ? "font-semibold text-blue-600"
            : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400";

    return (
        // এখানে sticky top-0 এবং z-50 যোগ করা হয়েছে যেন স্ক্রোল করার সময় নেভবারটি ভেসে থাকে
        <div className="sticky top-0 z-50">
            {/* মেইন নেভবার */}
            <nav className="w-full border-b border-separator bg-background/70 backdrop-blur-lg">
                <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

                    {/* লোগো এবং সাইট নেম */}
                    <div className="flex items-center gap-4">
                        {/* মোবাইল মেনু বাটন (hamburger icon) */}
                        <button
                            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* হোম পেজ লিংক সহ লোগো ইমেজ সেটিং */}
                        <Link href="/">
                            <div className="flex items-center gap-3">
                                <Image
                                    height={100}
                                    width={100}
                                    loading="eager"
                                    src="/logo.png"
                                    alt="logo"
                                    style={{ width: 'auto', height: 'auto' }}
                                    className="object-contain"
                                />
                                <p className="font-bold text-xl text-blue-600">ReadHaus</p>
                            </div>
                        </Link>
                    </div>

                    {/* ডেক্সটপ নেভিগেশন লিংক */}
                    <ul className="hidden items-center gap-6 md:flex">
                        <li>
                            <Link href="/" className={navClass("/")}>Home</Link>
                        </li>
                        <li>
                            <Link href="/browse" className={navClass("/browse")}>Browse Books</Link>
                        </li>
                        <li>
                            <Link href="/about" className={navClass("/about")}>About</Link>
                        </li>
                    </ul>

                    {/* ডান পাশ: থিম টগলার এবং ইউজার সেশন */}
                    <div className="flex items-center gap-4">
                        {/* ডার্ক মোড টগল বাটন */}
                        <Button
                            isIconOnly
                            variant="faded"
                            aria-label="Toggle theme"
                            onClick={toggleTheme}
                            className="rounded-full bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            {isDarkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
                        </Button>

                        {/* ইউজার অথেনটিকেশন বা ড্রপডাউন */}
                        {!user ? (
                            <div className="hidden items-center gap-4 md:flex">
                                <Link href="/login" className="text-gray-600 hover:text-blue-600 dark:text-gray-300">
                                    Login
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-blue-600 text-white font-medium">Sign Up</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden items-center gap-4 md:flex">
                                <Dropdown>
                                    <Dropdown.Trigger className="rounded-full cursor-pointer">
                                        <Avatar size="sm" aria-label="User Menu">
                                            <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                            <Avatar.Fallback>{user?.name?.charAt(0).toUpperCase() || "U"}</Avatar.Fallback>
                                        </Avatar>
                                    </Dropdown.Trigger>
                                    <Dropdown.Popover>
                                        <div className="px-3 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Avatar size="sm">
                                                    <Avatar.Image alt={user?.name} src={user?.image} />
                                                    <Avatar.Fallback>{user?.name?.charAt(0).toUpperCase()}</Avatar.Fallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium leading-none mb-1">{user?.name}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                                            <Dropdown.Item id="dashboard" textValue="Dashboard">
                                                <Link className="flex items-center gap-2 w-full" href={`/dashboard/${user?.role || "user"}/overview`}>
                                                    <MdDashboard className="text-lg" />
                                                    <Label className="cursor-pointer">Dashboard ({user?.role || "user"})</Label>
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item id="profile" textValue="Profile">
                                                <Link className="flex items-center gap-2 w-full" href="/profile">
                                                    <CgProfile className="text-lg" />
                                                    <Label className="cursor-pointer">Profile</Label>
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item id="logout" textValue="Logout" variant="danger" onClick={handleSignOut}>
                                                <div className="flex items-center gap-2 text-red-500">
                                                    <BiLogOut className="text-lg" />
                                                    <Label className="cursor-pointer text-red-500">Logout</Label>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown.Popover>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </header>

                {/* মোবাইল রেসপনসিভ মেনু */}
                {isMenuOpen && (
                    <div className="border-t border-separator md:hidden bg-background">
                        <ul className="flex flex-col gap-2 p-4">
                            <li>
                                <Link href="/" className={`block py-2 ${navClass("/")}`} onClick={() => setIsMenuOpen(false)}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/browse" className={`block py-2 ${navClass("/browse")}`} onClick={() => setIsMenuOpen(false)}>
                                    Browse Books
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className={`block py-2 ${navClass("/about")}`} onClick={() => setIsMenuOpen(false)}>
                                    About
                                </Link>
                            </li>

                            {/* মোবাইল ভিউতে সেশন অনুযায়ী ডাইনামিক বাটন */}
                            <li className="mt-2 pt-4 border-t border-separator flex flex-col gap-2">
                                {user ? (
                                    <>
                                        <Link
                                            href={`/dashboard/${user?.role || "readers"}/overview`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard ({user?.role})
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className={`block py-2 ${navClass("/profile")}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Button color="danger" variant="flat" className="w-full mt-2" onClick={handleSignOut}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="block py-2 text-center border rounded-medium text-gray-600 dark:text-gray-300"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full bg-blue-600 text-white">Sign Up</Button>
                                        </Link>
                                    </>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;