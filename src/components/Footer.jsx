"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-gray-800 transition-colors duration-300">

            {/* 🌟 TOP/MAIN FOOTER SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

                {/* 🧠 COLUMN 1: BRAND, LOGO & NICHE TEXT (Takes 2 columns space on larger screens) */}
                <div className="flex flex-col gap-4 md:col-span-2">
                    <div className="flex items-center gap-3">
                        {/* Logo Image */}
                        <div className="bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800">
                            <Image
                                src="/logo.png"
                                alt="ReadHaus Logo"
                                width={45}
                                height={45}
                                className="object-contain hover:rotate-6 transition-transform duration-300"
                            />
                        </div>

                        {/* Brand Name */}
                        <h2 className="text-2xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                                ReadHaus
                            </span>
                        </h2>
                    </div>

                    {/* Niche Paragraph Text */}
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400 max-w-sm">
                        Your ultimate sanctuary for knowledge, stories, and global perspectives.
                        We connect passionate readers with insightful books, articles, and community-driven
                        discussions to elevate your daily reading experience.
                    </p>

                    {/* Copyright (Moved here for better visual balance) */}
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
                        © {new Date().getFullYear()} ReadHaus Inc. All rights reserved.
                    </p>
                </div>

                {/* 🔗 COLUMN 2: EXPLORE LINKS */}
                <div>
                    <h3 className="font-bold text-sm tracking-wider uppercase text-slate-800 dark:text-gray-200 mb-4">
                        Explore
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href="/books" className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                All Books
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/blogs" className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Featured Articles
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🏢 COLUMN 3: COMPANY */}
                <div>
                    <h3 className="font-bold text-sm tracking-wider uppercase text-slate-800 dark:text-gray-200 mb-4">
                        Company
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href="/about" className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Contact Support
                            </Link>
                        </li>
                        <li>
                            <Link href="/careers" className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Careers
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🧾 COLUMN 4: NEWSLETTER & SOCIAL */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-sm tracking-wider uppercase text-slate-800 dark:text-gray-200">
                        Stay Updated
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-gray-400">
                        Subscribe to get updates on new arrivals and community events.
                    </p>

                    {/* Newsletter Input */}
                    <div className="flex shadow-sm rounded-lg overflow-hidden border border-slate-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 text-xs transition-all duration-200">
                            Join
                        </button>
                    </div>

                    {/* 🌐 SOCIAL ICONS CONTAINER */}
                    <div className="flex items-center gap-3.5 mt-2">
                        {/* Twitter / X */}
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:shadow-md transition-all hover:-translate-y-0.5" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2H21l-6.56 7.5L22 22h-6.78l-5.29-6.6L4.2 22H2l7.02-8.03L2 2h6.91l4.82 6.02L18.244 2z" />
                            </svg>
                        </a>

                        {/* Facebook */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:shadow-md transition-all hover:-translate-y-0.5" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 hover:shadow-md transition-all hover:-translate-y-0.5" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-600 hover:shadow-md transition-all hover:-translate-y-0.5" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>

                        {/* GitHub */}
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all hover:-translate-y-0.5" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </a>

                        {/* Gravity / Orbit Icon */}
                        <a href="https://gravity.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:shadow-md transition-all hover:-translate-y-0.5" aria-label="Gravity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-[spin_10s_linear_infinite]">
                                <circle cx="12" cy="12" r="3" />
                                <circle cx="12" cy="12" r="8" />
                                <line x1="3" x2="9" y1="12" y2="12" />
                                <line x1="15" x2="21" y1="12" y2="12" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>

            {/* 🔒 BOTTOM BAR (LEGAL & CREDITS) */}
            <div className="border-t border-slate-200 dark:border-gray-800 bg-slate-100/50 dark:bg-gray-950/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-400">

                    {/* Legal Links */}
                    <div className="flex items-center gap-6 order-2 sm:order-1">
                        <Link href="/privacy" className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-slate-800 dark:hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-slate-800 dark:hover:text-white transition-colors">Cookie Settings</Link>
                    </div>

                    {/* Author Credit */}
                    <div className="order-1 sm:order-2 tracking-wide">
                        Built with ❤️ by <span className="font-semibold text-slate-700 dark:text-gray-300">ReadHaus Team</span>
                    </div>

                </div>
            </div>

        </footer>
    );
}