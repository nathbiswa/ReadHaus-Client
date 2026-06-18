'use client'
import React from 'react';
import { motion } from 'framer-motion'; // 🛠️ এখানে ফিক্স করা হয়েছে
import { Book, Heart, Rocket, ShieldAlert, Cpu, Palette } from 'lucide-react';

// ৬টি জনপ্রিয় ক্যাটাগরির স্ট্যাটিক ডাটা
const categories = [
    {
        id: 1,
        name: "Sci-Fi & Technology",
        count: "120+ Books",
        icon: Cpu,
        color: "from-blue-500/20 to-cyan-500/20",
        borderColor: "hover:border-cyan-500/50",
        iconColor: "text-cyan-400"
    },
    {
        id: 2,
        name: "Fiction & Literature",
        count: "85+ Books",
        icon: Book,
        color: "from-amber-500/20 to-orange-500/20",
        borderColor: "hover:border-amber-500/50",
        iconColor: "text-amber-400"
    },
    {
        id: 3,
        name: "Romance & Drama",
        count: "64+ Books",
        icon: Heart,
        color: "from-rose-500/20 to-pink-500/20",
        borderColor: "hover:border-rose-500/50",
        iconColor: "text-rose-400"
    },
    {
        id: 4,
        name: "Mystery & Thriller",
        count: "95+ Books",
        icon: ShieldAlert,
        color: "from-purple-500/20 to-indigo-500/20",
        borderColor: "hover:border-purple-500/50",
        iconColor: "text-purple-400"
    },
    {
        id: 5,
        name: "Self-Development",
        count: "110+ Books",
        icon: Rocket,
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "hover:border-emerald-500/50",
        iconColor: "text-emerald-400"
    },
    {
        id: 6,
        name: "Arts & Photography",
        count: "45+ Books",
        icon: Palette,
        color: "from-fuchsia-500/20 to-pink-500/20",
        borderColor: "hover:border-fuchsia-500/50",
        iconColor: "text-fuchsia-400"
    }
];

const PopularCategories = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-900 text-white overflow-hidden border-t border-gray-800">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Section Heading */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-amber-400 font-semibold tracking-wider text-xs md:text-sm uppercase mb-2"
                    >
                        Populer Section
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold font-serif text-gray-100"
                    >
                        Explore Popular Categories
                    </motion.h2>
                    <p className="text-gray-400 text-sm mt-2">Find your next great read by browsing through our most requested genres</p>
                    <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => {
                        const IconComponent = category.icon;
                        return (
                            <motion.a
                                href={`/browse?category=${encodeURIComponent(category.name)}`}
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className={`relative block p-6 bg-gradient-to-br ${category.color} border border-gray-800 rounded-xl transition-all duration-300 ${category.borderColor} shadow-lg hover:shadow-2xl group overflow-hidden`}
                            >
                                {/* Background decorative glow effect on hover */}
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full transition-transform duration-500 group-hover:scale-150" />

                                <div className="flex items-center gap-4">
                                    {/* Icon Container */}
                                    <div className={`p-4 bg-gray-950/60 rounded-xl border border-gray-800 transition-colors duration-300 ${category.iconColor}`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>

                                    {/* Category Info */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-amber-400 transition-colors font-serif">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-0.5">
                                            {category.count}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-amber-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default PopularCategories;