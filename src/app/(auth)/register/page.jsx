"use client";

import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
    Button,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // অ্যানিমেশনের জন্য ইম্পোর্ট করা হয়েছে

export default function RegisterPage() {
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const rawUser = Object.fromEntries(formData.entries());

        // 🔒 পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে কিনা চেক (নিরাপত্তার জন্য)
        if (rawUser.password !== rawUser.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // 🛠️ লজিক ফিক্স: Better Auth এর জন্য ডাটা ফিল্টার করা হলো যেন অপ্রয়োজনীয় ফিল্ড না যায়
        const { confirmPassword, photo, ...cleanUserData } = rawUser;

        const { user: data, error } = await authClient.signUp.email({
            ...cleanUserData,
            image: photo || "" // photo কে image হিসেবে পাঠানো হচ্ছে
        });

        if (!error) {
            toast.success('Register successful');
            router.push("/");
        } else {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
        router.push("/");
    };

    return (
        // ব্যাকগ্রাউন্ডে প্রিমিয়াম গ্রাডিয়েন্ট অরবিটাল লুক দেওয়া হয়েছে
        <div className="relative min-h-screen py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 px-4 overflow-hidden">

            {/* ব্যাকগ্রাউন্ড ডেকোরেティブ গ্লোয়িং সার্কেল */}
            <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />

            {/* মেইন কার্ড এন্ট্রি অ্যানিমেশন */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 relative z-10"
            >
                {/* TITLE & LOGO AREA */}
                <div className="flex flex-col items-center mb-6">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                        <Image src="/logo.webp" alt="ReadHaus Logo" width={50} height={50} className="mb-2 object-contain hidden dark:block" onError={(e) => e.target.style.display = 'none'} />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
                        Join ReadHaus as Reader or Librarian
                    </p>
                </div>

                {/* FORM */}
                <Form className="flex flex-col gap-4" onSubmit={onSubmit}>

                    {/* NAME */}
                    <TextField isRequired name="name" className="transition-all duration-200">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Full Name</Label>
                        <Input className="hover:border-blue-400 focus:border-blue-500" placeholder="John Doe" />
                        <FieldError className="text-xs text-red-500 mt-1" />
                    </TextField>

                    {/* EMAIL */}
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                    >
                        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Email</Label>
                        <Input className="hover:border-blue-400" placeholder="john@example.com" />
                        <FieldError className="text-xs text-red-500 mt-1" />
                    </TextField>

                    {/* PHOTO */}
                    <TextField name="photo">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Photo URL</Label>
                        <Input className="hover:border-blue-400" placeholder="https://..." />
                        <FieldError className="text-xs text-red-500 mt-1" />
                    </TextField>

                    {/* PASSWORD */}
                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        validate={(value) => {
                            if (value.length < 8) return "Password must be at least 8 characters";
                            if (!/[A-Z]/.test(value)) return "Must contain uppercase letter";
                            if (!/[0-9]/.test(value)) return "Must contain number";
                            return null;
                        }}
                    >
                        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Password</Label>
                        <Input className="hover:border-blue-400" placeholder="Enter password" />
                        <Description className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                            8+ chars, 1 uppercase, 1 number
                        </Description>
                        <FieldError className="text-xs text-red-500 mt-1" />
                    </TextField>

                    {/* CONFIRM PASSWORD */}
                    <TextField isRequired name="confirmPassword" type="password">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Confirm Password</Label>
                        <Input className="hover:border-blue-400" placeholder="Confirm password" />
                        <FieldError className="text-xs text-red-500 mt-1" />
                    </TextField>

                    {/* ROLE */}
                    <TextField isRequired name="role">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Role</Label>
                        {/* 🛠️ লজিক ফিক্স: defaultValue এবং value পরিবর্তন করে "readers" করা হলো */}
                        <select
                            name="role"
                            defaultValue="readers"
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm cursor-pointer"
                        >
                            <option value="readers">User (Reader)</option>
                            <option value="librarian">Librarian</option>
                        </select>
                        <FieldError />
                    </TextField>

                    {/* SUBMIT BUTTONS WITH HOVER & ACTIVE ANIMATION */}
                    <div className="flex gap-3 pt-3">
                        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/10 rounded-xl h-11 flex items-center justify-center gap-2">
                                <Check className="text-lg" />
                                Create Account
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="reset" variant="secondary" className="h-11 border border-gray-200 dark:border-gray-700 dark:text-gray-300 rounded-xl px-5">
                                Reset
                            </Button>
                        </motion.div>
                    </div>

                </Form>

                {/* LOGIN LINK */}
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 transition-all">
                        Login
                    </Link>
                </p>

                {/* GOOGLE LOGIN */}
                <div className="mt-4">
                    <div className="flex items-center my-5">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="px-3 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wider">OR</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all shadow-sm"
                        >
                            <Image
                                src="/google.png"
                                alt="google"
                                width={20}
                                height={20}
                                className="shrink-0"
                            />
                            <span>Continue with Google</span>
                        </Button>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
}