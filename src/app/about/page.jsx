"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Award, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Animation Variants (Smooth Fade In)
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden relative selection:bg-amber-400 selection:text-gray-900">

            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10 space-y-24">

                {/* 1. Hero Section */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-center space-y-6 max-w-3xl mx-auto"
                >
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/5 px-4 py-1.5 rounded-full border border-amber-400/10 uppercase tracking-widest">
                        Our Journey
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-serif tracking-tight leading-tight">
                        We are Re-defining the World of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Digital Reading</span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                        ReadHaus is a modern platform built to seamlessly connect book lovers and librarians. It offers a unique medium to read books, share genuine reviews, and effortlessly manage personal literary collections.
                    </p>
                </motion.section>

                {/* 2. Project Details Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-2 text-amber-400">
                            <BookOpen className="w-6 h-6" /> About Our Project
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                            The core objective of our project is to digitize and simplify the traditional book-sharing ecosystem. On ReadHaus, readers can effortlessly browse their favorite genres, explore aggregate ratings, and instantly request deliveries with integrated security features.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            On the other hand, librarians enjoy full administrative support through a dedicated dashboard panel, allowing them to instantly publish new arrivals, edit inventory listings, or manage existing borrow states.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                                <h4 className="text-xl font-bold text-amber-400">1000+</h4>
                                <p className="text-xs text-gray-400 mt-1">Books Available</p>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                                <h4 className="text-xl font-bold text-amber-400">500+</h4>
                                <p className="text-xs text-gray-400 mt-1">Active Readers & Librarians</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Project Features (Staggered Grid) */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-5 rounded-2xl space-y-3 hover:border-amber-400/20 transition-colors">
                            <ShieldCheck className="w-8 h-8 text-amber-400" />
                            <h3 className="font-semibold text-gray-200">Secure Payments</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">Every individual delivery transaction and user record is fully encrypted and secure.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-5 rounded-2xl space-y-3 hover:border-blue-400/20 transition-colors">
                            <Users className="w-8 h-8 text-blue-400" />
                            <h3 className="font-semibold text-gray-200">Community Driven</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">Bridging the spatial gap between eager readers and resourceful independent librarians.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-5 rounded-2xl space-y-3 hover:border-rose-400/20 transition-colors">
                            <Heart className="w-8 h-8 text-rose-400" />
                            <h3 className="font-semibold text-gray-200">Wishlist & Reviews</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">Save future reads into wishlists and provide transparent ratings post-purchase.</p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-5 rounded-2xl space-y-3 hover:border-purple-400/20 transition-colors">
                            <Award className="w-8 h-8 text-purple-400" />
                            <h3 className="font-semibold text-gray-200">Dashboard Control</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">Tailored experience via personalized role-based control centers.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 3. Meet the Team Section */}
                <section className="space-y-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center space-y-3"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold font-serif text-amber-400">The Brains Behind ReadHaus</h2>
                        <p className="text-gray-400 text-sm max-w-xl mx-auto">This project is born out of constant dedication, structured planning, and an absolute love for modern code.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Member 1 */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center space-y-4 shadow-xl"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full p-1 shadow-inner relative overflow-hidden">
                                <div className="w-full h-full bg-gray-950 rounded-full flex items-center justify-center font-bold text-xl text-amber-400">
                                    Dev 1
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-200 text-lg">Your Name</h4>
                                <p className="text-xs text-amber-400 font-medium tracking-wide">Full Stack Developer</p>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Supervised core database structures, Next.js page state architectures, and robust MongoDB integrations cleanly.
                            </p>
                        </motion.div>

                        {/* Member 2 */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center space-y-4 shadow-xl"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full p-1 shadow-inner relative overflow-hidden">
                                <div className="w-full h-full bg-gray-950 rounded-full flex items-center justify-center font-bold text-xl text-blue-400">
                                    Dev 2
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-200 text-lg">Team Member 2</h4>
                                <p className="text-xs text-blue-400 font-medium tracking-wide">UI/UX & Frontend Engineer</p>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Designed smooth user interactions, crafted dark theme palettes, and structured highly responsive Tailwind components.
                            </p>
                        </motion.div>

                        {/* Member 3 */}
                        <motion.div
                            variants={fadeInUp}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center space-y-4 shadow-xl"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full p-1 shadow-inner relative overflow-hidden">
                                <div className="w-full h-full bg-gray-950 rounded-full flex items-center justify-center font-bold text-xl text-purple-400">
                                    Dev 3
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-200 text-lg">Team Member 3</h4>
                                <p className="text-xs text-purple-400 font-medium tracking-wide">Backend & Security QA</p>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Integrated custom session configurations, protected API routes, and maintained strict end-to-end platform security.
                            </p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 4. Call To Action (CTA) Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-2xl relative"
                >
                    <h2 className="text-2xl md:text-3xl font-bold font-serif">Ready to explore our collection?</h2>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto">
                        Join our marvelous reading catalog community today. Browse verified catalogs or expand your library reaching out to thousands.
                    </p>
                    <div className="flex justify-center pt-2">
                        <Link
                            href="/browse"
                            className="flex items-center gap-2 py-3 px-6 bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-bold rounded-xl transition-all shadow-lg shadow-amber-400/10 group"
                        >
                            Start Browsing Books
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.section>

            </div>
        </main>
    );
}