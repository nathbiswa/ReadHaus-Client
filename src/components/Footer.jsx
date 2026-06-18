"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-10">

            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* 🧠 BRAND (LOGO + NAME SEPARATE) */}
                <div className="flex flex-col gap-3">

                    <div className="flex items-center gap-2">

                        {/* Logo Image */}
                        <Image
                            src="/logo.png"
                            alt="ReadHaus Logo"
                            width={90}
                            height={90}
                            className="object-contain hover:scale-110 transition"
                        />

                        {/* Brand Name */}
                        <h2 className="text-xl font-bold">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                                ReadHaus
                            </span>
                        </h2>

                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} ReadHaus. All rights reserved.
                    </p>

                </div>

                {/* 🔗 QUICK LINKS */}
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                        Quick Links
                    </h3>

                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/about" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                About
                            </Link>
                        </li>

                        <li>
                            <Link href="/contact" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                Contact
                            </Link>
                        </li>

                        <li>
                            <Link href="/privacy" className="hover:text-primary text-gray-600 dark:text-gray-300">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🧾 NEWSLETTER + SOCIAL */}
                <div>

                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                        Newsletter
                    </h3>

                    {/* Input */}
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="
                w-full px-3 py-2 text-sm
                border border-gray-300 dark:border-gray-700
                rounded-l-md
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                focus:outline-none
              "
                        />

                        <button className="bg-primary text-white px-4 rounded-r-md hover:bg-primary-hover transition">
                            Join
                        </button>
                    </div>

                    {/* 🌐 SOCIAL ICON (X) */}
                    <div className="flex items-center gap-4 mt-4">

                        <a
                            href="https://x.com"
                            target="_blank"
                            className="text-gray-600 dark:text-gray-300 hover:text-primary transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.244 2H21l-6.56 7.5L22 22h-6.78l-5.29-6.6L4.2 22H2l7.02-8.03L2 2h6.91l4.82 6.02L18.244 2z" />
                            </svg>
                        </a>

                    </div>

                </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-800">
                Built with ❤️ by ReadHaus Team
            </div>

        </footer>
    );
}