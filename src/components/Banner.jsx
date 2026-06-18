'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "Welcome to ReadHaus",
        subtitle: "Your Local Library, Delivered",
        description: "Browse thousands of books from local libraries and independent owners. No physical visits required, just pure reading pleasure.",
        bgImage: "https://i.ibb.co.com/RGXRxCDp/photo-1507842217343-583bb7270b66.avif",
        btnText: "Browse Books",
        link: "/browse"
    },
    {
        id: 2,
        title: "Empowering Local Libraries",
        subtitle: "Connecting Readers with Neighborhood Providers",
        description: "Support your local librarians and independent book owners by borrowing from their curated collections seamlessly.",
        bgImage: "https://i.ibb.co.com/d0BJGNbn/image2.avif",
        btnText: "Explore Collections",
        link: "/browse"
    },
    {
        id: 3,
        title: "Secure & Swift Delivery",
        subtitle: "Doorstep Delivery via Stripe Payments",
        description: "Request your next favorite read with a nominal delivery fee secured by Stripe. Track your delivery status from pending to delivered.",
        bgImage: "https://i.ibb.co.com/pj2jwsNL/image3.jpg",
        btnText: "Borrow Now",
        link: "/browse"
    },
    {
        id: 4,
        title: "Join as a Book Provider",
        subtitle: "Share Your Inventory & Reach a Wider Audience",
        description: "Are you a librarian or a book owner? List your books using our advanced image hosting integration and manage requests effortlessly.",
        bgImage: "https://i.ibb.co.com/0g0L5vD/image4.avif",
        btnText: "Become a Librarian",
        link: "/register"
    },
    {
        id: 5,
        title: "Verified Community Reviews",
        subtitle: "Transparent Feedback from Real Readers",
        description: "Only users who have successfully received a book can leave ratings and comments. Trust the community, enjoy your read.",
        bgImage: "https://i.ibb.co.com/23nqscyH/image5.avif",
        btnText: "View Popular Books",
        link: "/browse"
    }
];

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto play functionality (5 seconds per slide)
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(slideInterval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-gray-900">
            {/* Slides with Framer Motion Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
                >
                    {/* Dark Overlay for premium look & readable contrast */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

                    {/* Slide Content Layout */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-12 max-w-5xl mx-auto z-10 text-white">

                        {/* Top Tagline */}
                        <motion.span
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-amber-400 font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.span>

                        {/* Main Title */}
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif mb-4 leading-tight"
                        >
                            {slides[currentSlide].title}
                        </motion.h1>

                        {/* Description Paragraph */}
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-sm md:text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed"
                        >
                            {slides[currentSlide].description}
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                        >
                            <a
                                href={slides[currentSlide].link}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-amber-400 hover:bg-amber-500 transition-colors duration-200 shadow-lg shadow-amber-500/20 uppercase tracking-wider font-bold"
                            >
                                {slides[currentSlide].btnText}
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Manual Navigation Controls (Arrows) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 hidden md:block"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10 hidden md:block"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Pagination Indicators (Dots) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/40'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Banner;