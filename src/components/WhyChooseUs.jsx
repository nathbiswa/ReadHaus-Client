"use client";

import { BookOpen, ShieldCheck, Zap, Users, ArrowUpRight } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        {
            icon: <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
            title: "Vast Library",
            description: "Access thousands of books, curated articles, and global perspectives right at your fingertips.",
            gradient: "from-blue-600 via-indigo-500 to-cyan-500",
            shadow: "hover:shadow-blue-500/10"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
            title: "Secure & Trusted",
            description: "Your data and reading privacy are protected with top-notch encryption and safety standards.",
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            shadow: "hover:shadow-emerald-500/10"
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
            title: "Lightning Fast",
            description: "Experience ultra-fast page loads, seamless searches, and an instant response UI.",
            gradient: "from-amber-500 via-orange-500 to-yellow-500",
            shadow: "hover:shadow-amber-500/10"
        },
        {
            icon: <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Active Community",
            description: "Engage with passion-driven readers, share insights, and join stimulating discussions.",
            gradient: "from-indigo-500 via-purple-500 to-pink-500",
            shadow: "hover:shadow-indigo-500/10"
        }
    ];

    return (
        <section className="relative overflow-hidden bg-slate-50 dark:bg-gray-950 px-6 sm:px-12 py-24 lg:py-32 transition-colors duration-500">

            {/* 🌌 PREMIUM BG GLOW ORBS (Light and Dark fine-tuned) */}
            <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse duration-10000" />
            <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 dark:from-purple-500/10 dark:to-transparent blur-[140px] rounded-full pointer-events-none animate-pulse duration-7000" />

            <div className="relative max-w-7xl mx-auto">

                {/* 🎯 HEADER SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">

                    {/* Badge Component */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm transition-transform hover:scale-105 duration-300">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                        <span className="text-xs font-bold tracking-wider uppercase text-slate-800 dark:text-gray-200">
                            Why Choose Us
                        </span>
                    </div>

                    {/* Animated Gradient Title */}
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                        Crafting the Ultimate Space for{" "}
                        <span className="relative inline-block bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                            Next-Gen Reading
                        </span>
                    </h2>

                    <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">
                        Discover why thousands of tech enthusiasts, modern learners, and book lovers choose ReadHaus daily.
                    </p>
                </div>

                {/* 🎴 HIGH-END ANIME CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-2xl p-8 bg-white dark:bg-gray-900/50 border border-slate-200/80 dark:border-gray-800/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 dark:hover:border-gray-700 ${feature.shadow} shadow-sm shadow-slate-100/50 dark:shadow-none`}
                        >
                            {/* Inner Radial Aura Glow on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none rounded-2xl`} />

                            {/* Top Corner Dynamic Link Arrow */}
                            <div className="absolute top-6 right-6 text-slate-300 dark:text-gray-700 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>

                            {/* Premium Icon Shell (with hover self-rotation & spring bounce) */}
                            <div className="relative inline-flex items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800 shadow-inner group-hover:scale-110 group-hover:rotate-[12deg] transition-all duration-500 ease-out">
                                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 shadow-sm" />
                                {feature.icon}
                            </div>

                            {/* Feature Text */}
                            <div className="relative mt-6 space-y-2.5">
                                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400 font-normal">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Liquid Border Bottom Line Animation */}
                            <div className={`absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}