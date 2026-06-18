"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, MapPin } from 'lucide-react';
import Image from 'next/image';

// স্ট্যাটিক ডাটা: ৩ জন টপ লাইব্রেরিয়ান
const librarians = [
    {
        id: 1,
        name: "Dr. Eleanor Vance",
        role: "Chief Archivist",
        completedDeliveries: 342,
        location: "Dhaka Central Library",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
        bio: "Specializes in rare historical manuscripts and classical literature. Successfully delivered hundreds of books to avid readers.",
        direction: "left" // বাম থেকে আসবে
    },
    {
        id: 2,
        name: "Jonathan Readhaus",
        role: "Independent Book Owner",
        completedDeliveries: 289,
        location: "Chittagong Hub",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
        bio: "Passionate about modern sci-fi and tech journals. Keeping the local neighborhood updated with super-fast delivery dispatch.",
        direction: "top" // উপর থেকে আসবে
    },
    {
        id: 3,
        name: "Sarah Jenkins",
        role: "Senior Librarian",
        completedDeliveries: 256,
        location: "Sylhet Public Library",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
        bio: "Dedicated to promoting children's fiction and academic textbooks. Ensuring safe and verified book transfers every time.",
        direction: "right" // ডান থেকে আসবে
    }
];

// ফ্রেমর মোশন ভ্যারিয়েন্টস (দিক অনুযায়ী অ্যানিমেশন কন্ট্রোল)
const cardVariants = {
    hidden: (direction) => ({
        opacity: 0,
        x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
        y: direction === 'top' ? -100 : 0,
    }),
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 15,
            duration: 0.8
        }
    }
};

const TopLibrarians = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-950 text-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Section Heading & Subtitle */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-amber-400 font-semibold tracking-wider text-xs md:text-sm uppercase mb-2"
                    >
                        Extra Section 1
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold font-serif text-gray-100"
                    >
                        Top Librarians & Providers
                    </motion.h2>
                    <p className="text-gray-400 text-sm mt-2">Recognizing our top providers with the most completed doorstep deliveries</p>
                    <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
                </div>

                {/* Librarians Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {librarians.map((librarian) => (
                        <motion.div
                            key={librarian.id}
                            custom={librarian.direction} // এখানে দিক পাস করা হচ্ছে (left, top, right)
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ y: -8 }}
                            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-400/30 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image / Avatar Section */}
                            <div className="relative h-64 overflow-hidden group">
                                <Image
                                    src={librarian.image}
                                    alt={librarian.name}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

                                {/* Badge/Role */}
                                <div className="absolute top-4 left-4 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {librarian.role}
                                </div>

                                {/* Completed Deliveries Badge */}
                                <div className="absolute bottom-4 right-4 bg-gray-950/80 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{librarian.completedDeliveries} Deliveries</span>
                                </div>
                            </div>

                            {/* Card Details Body */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-100 mb-1 font-serif">
                                    {librarian.name}
                                </h3>

                                {/* Location */}
                                <div className="flex items-center text-gray-400 text-xs mb-4 gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{librarian.location}</span>
                                </div>

                                {/* Short Bio */}
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                    "{librarian.bio}"
                                </p>

                                {/* Divider */}
                                <div className="w-full h-px bg-gray-800 mb-4" />

                                {/* Stats Footer */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Performance Status</span>
                                    <span className="text-amber-400 font-medium text-xs bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                        Top Verified Seller
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TopLibrarians;