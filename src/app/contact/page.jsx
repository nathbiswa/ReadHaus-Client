"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { toast } from "react-toastify";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        // Simulate API Call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Message sent successfully! We'll get back to you soon. 🚀");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden relative selection:bg-amber-400 selection:text-gray-900">

            {/* Background Subtle Glows */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative z-10 space-y-16">

                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-center space-y-4 max-w-2xl mx-auto"
                >
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/5 px-4 py-1.5 rounded-full border border-amber-400/10 uppercase tracking-widest">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight">
                        We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Hear From You</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Have questions about ReadHaus? Whether you are a reader looking for support or a librarian wanting to collaborate, drop us a line!
                    </p>
                </motion.div>

                {/* Core Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Side: Contact Details */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="lg:col-span-5 space-y-6"
                    >
                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex gap-4 items-start">
                            <div className="p-3 bg-amber-400/10 rounded-xl text-amber-400 border border-amber-400/20">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-200 text-base">Email Us</h3>
                                <p className="text-xs text-gray-400 mt-1">For general inquiries and technical help.</p>
                                <a href="mailto:support@readhaus.com" className="text-sm font-medium text-amber-400 hover:underline mt-2 inline-block">support@readhaus.com</a>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex gap-4 items-start">
                            <div className="p-3 bg-blue-400/10 rounded-xl text-blue-400 border border-blue-400/20">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-200 text-base">Call Support</h3>
                                <p className="text-xs text-gray-400 mt-1">Mon-Fri from 9am to 6pm.</p>
                                <a href="tel:+1234567890" className="text-sm font-medium text-blue-400 hover:underline mt-2 inline-block">+1 (234) 567-890</a>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex gap-4 items-start">
                            <div className="p-3 bg-purple-400/10 rounded-xl text-purple-400 border border-purple-400/20">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-200 text-base">Our Headquarters</h3>
                                <p className="text-xs text-gray-400 mt-1">Visit our local developer hub.</p>
                                <p className="text-sm font-medium text-gray-300 mt-2">123 Literature Lane, Dhaka, Bangladesh</p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex gap-4 items-start">
                            <div className="p-3 bg-emerald-400/10 rounded-xl text-emerald-400 border border-emerald-400/20">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-200 text-base">Response Time</h3>
                                <p className="text-xs text-gray-400 mt-1">We usually review forms within 24 hours.</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: Animated Contact Form */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold font-serif text-gray-200 mb-6 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-amber-400" /> Send a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-400/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-400/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-400/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Type your message here..."
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-gray-100 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-6 bg-amber-400 text-gray-900 hover:bg-amber-500 font-bold rounded-xl uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}