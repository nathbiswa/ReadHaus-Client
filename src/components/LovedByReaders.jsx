"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";

export default function LovedByReaders() {
    const testimonials = [
        {
            name: "Anika Rahman",
            role: "Literature Student",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            review: "ReadHaus has completely changed how I discover books. The personalized suggestions and speed of the UI are top-notch!",
            rating: 5
        },
        {
            name: "Siam Ahmed",
            role: "Tech Enthusiast & Blogger",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            review: "The dark mode implementation is incredibly soothing for night readers like me. A pure premium experience!",
            rating: 5
        },
        {
            name: "Tanvir Hossain",
            role: "Avid Reader",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            review: "Finding rare curated articles used to take hours. Now, ReadHaus brings everything into one beautiful space.",
            rating: 5
        },
        {
            name: "Nusrat Jahan",
            role: "Researcher",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            review: "Clean UI, lightning-fast transitions, and zero distractions. The perfect sanctuary for book lovers.",
            rating: 5
        }
    ];

    return (
        <section className="relative overflow-hidden bg-slate-50 dark:bg-gray-950 px-6 sm:px-12 py-24 lg:py-32 border-t border-slate-100 dark:border-gray-900/60 transition-colors duration-500">

            {/* 🌌 VISUAL BACKGROUND GLOWS */}
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-pink-500/10 dark:bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">

                {/* 🎯 HEADER SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                        <span className="text-xs font-bold tracking-wider uppercase text-slate-800 dark:text-gray-200">
                            Community Love
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                        Loved by{" "}
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                            Thousands of Readers
                        </span>
                    </h2>

                    <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-medium">
                        Don't just take our word for it. Here is what our global reading community has to say about ReadHaus.
                    </p>
                </div>

                {/* 🎴 TESTIMONIAL CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((item, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-between p-8 rounded-2xl bg-white dark:bg-gray-900/40 border border-slate-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-md"
                        >
                            {/* Decorative Top Quote Icon */}
                            <div className="absolute top-6 right-6 text-slate-100 dark:text-gray-800/50 group-hover:text-pink-500/10 transition-colors duration-500">
                                <Quote className="w-12 h-12 rotate-180 transform" fill="currentColor" />
                            </div>

                            {/* Review Content */}
                            <div className="relative space-y-4">
                                {/* Stars */}
                                <div className="flex items-center gap-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400 font-normal italic">
                                    "{item.review}"
                                </p>
                            </div>

                            {/* User Profile Info */}
                            <div className="relative flex items-center gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-gray-800/60">
                                {/* Avatar with Neon Border */}
                                <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-md">
                                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                                        <Image
                                            src={item.avatar}
                                            alt={item.name}
                                            fill
                                            sizes="44px"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name & Identity */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white transition-colors group-hover:text-pink-500 dark:group-hover:text-pink-400">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}