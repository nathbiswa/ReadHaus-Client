"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Bars, Xmark } from "@gravity-ui/icons";
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(false);

    const navRef = useRef(null);

    // 🌙 Load theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        }

        // ✨ GSAP animation
        gsap.from(navRef.current, {
            y: -80,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });
    }, []);

    // 🌙 Toggle theme
    const toggleTheme = () => {
        setDark((prev) => {
            const newTheme = !prev;

            if (newTheme) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }

            return newTheme;
        });
    };

    // 🎯 Active route style
    const navClass = (path) =>
        pathname === path
            ? "text-primary font-semibold border-b-2 border-primary"
            : "text-textSecondary dark:text-gray-300 hover:text-primary";

    return (
        <nav
            ref={navRef}
            className="bg-white dark:bg-gray-900 shadow-md px-6 transition-colors duration-300"
        >
            <div className="flex items-center justify-between h-16">

                {/* LEFT LOGO (IMAGE + NAME SEPARATE) */}
                <div className="flex-1 flex items-center">

                    {/* Logo Image */}
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="ReadHaus Logo"
                            width={120}
                            height={100}
                            className="object-contain hover:scale-110 transition"
                        />
                    </Link>

                    {/* Logo Text */}
                    <Link href="/" className="text-xl font-bold">
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                            ReadHaus
                        </span>
                    </Link>

                </div>

                {/* CENTER MENU */}
                <div className="hidden md:flex flex-1 justify-center items-center gap-7">

                    <Link href="/" className={navClass("/")}>Home</Link>
                    <Link href="/books" className={navClass("/books")}>Browse</Link>
                    <Link href="/features" className={navClass("/features")}>Features</Link>
                    <Link href="/how-it-works" className={navClass("/how-it-works")}>Works</Link>
                    <Link href="/about" className={navClass("/about")}>About</Link>
                    <Link href="/contact" className={navClass("/contact")}>Contact</Link>

                </div>

                {/* RIGHT SIDE */}
                <div className="flex-1 flex justify-end items-center gap-3">

                    {/* 🌙 Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="
              px-1 py-0 md:px-3 py-1 rounded-full
              border border-gray-300 dark:border-gray-600
              text-sm
              hover:scale-105 transition
            "
                    >
                        {dark ? "☀️ Light" : "🌙 Dark"}
                    </button>

                    {/* 🔑 LOGIN (soft background) */}
                    <Link
                        href="/login"
                        className="
              px-4 py-1 rounded-full
              bg-blue-50 text-primary
              hover:bg-blue-100
              transition
              font-medium
              dark:bg-gray-800 dark:text-white
            "
                    >
                        Login
                    </Link>

                    {/* 🚀 GET STARTED (gradient CTA) */}
                    <Link
                        href="/register"
                        className="
              px-4 py-1 rounded-full
              bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500
              text-white
              hover:scale-105
              transition
              md:font-medium
              text-[12px]
              shadow-md
            "
                    >
                        Register
                    </Link>

                    {/* 📱 MOBILE MENU */}
                    <button
                        className="md:hidden text-primary"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <Xmark /> : <Bars />}
                    </button>
                </div>
            </div>

            {/* 📱 MOBILE MENU */}
            {open && (
                <div className="md:hidden flex flex-col gap-4 py-4">

                    <Link href="/">Home</Link>
                    <Link href="/books">Browse</Link>
                    <Link href="/features">Features</Link>
                    <Link href="/how-it-works">How It Works</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>

                    <div className="flex gap-3 pt-3">
                        <Link href="/login" className="bg-blue-50 px-3 py-1 rounded">
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="text-[10px] md:text-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded"
                        >
                            Get Started
                        </Link>
                    </div>

                </div>
            )}
        </nav>
    );
}