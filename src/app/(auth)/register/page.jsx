"use client";
import { authClient } from "@/lib/auth-client";
import {
    Button,
    Description,
    FieldError,
    Fieldset,
    Form,
    Input,
    Label,
    Surface,
    ListBox,
    Select,
    TextField,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link"; // 🚀 লিঙ্ক ইম্পোর্ট করা হলো
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries());

        // 🔒 পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড চেক
        if (user.password !== user.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const { data, error } = await authClient.signUp.email({
            ...user,
        });

        if (!error) {
            toast.success('Register successful! 🎉');
            redirect('/');
        } else {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
        redirect('/');
    };

    return (
        <div className="relative min-h-screen py-12 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900 px-4 overflow-hidden">

            {/* ব্যাকগ্রাউন্ড ডেকোরেティブ গ্লোয়িং সার্কেল */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />

            {/* মেইন কার্ড এন্ট্রি অ্যানিমেশন */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 relative z-10"
            >
                {/* TITLE AREA */}
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
                        Join us and create your new profile
                    </p>
                </div>

                {/* FORM */}
                <Form onSubmit={onSubmit}>
                    <Fieldset className="w-full flex flex-col gap-4">
                        <Fieldset.Group className="flex flex-col gap-4">

                            <TextField isRequired name="name">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Name</Label>
                                <Input placeholder="John Doe" className="hover:border-blue-400 focus:border-blue-500" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>

                            <TextField name="image" type="url">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Image URL</Label>
                                <Input placeholder="https://example.com/image.jpg" className="hover:border-blue-400" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>

                            <TextField isRequired name="email" type="email">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Email</Label>
                                <Input placeholder="john@example.com" className="hover:border-blue-400" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>

                            <TextField isRequired name="password" type="password">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Password</Label>
                                <Input placeholder="Enter password" className="hover:border-blue-400" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>

                            <TextField isRequired name="confirmPassword" type="password">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Confirm Password</Label>
                                <Input placeholder="Confirm password" className="hover:border-blue-400" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>

                            <Select isRequired name="role" placeholder="Select one">
                                <Label className="text-gray-700 dark:text-gray-300 font-medium text-sm">Signup As</Label>
                                <Select.Trigger className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm cursor-pointer">
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        <ListBox.Item id="readers" textValue="readers">
                                            Reader
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                        <ListBox.Item id="librarian" textValue="librarian">
                                            Librarian
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </Fieldset.Group>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-3">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/10 rounded-xl h-11 flex items-center justify-center gap-2">
                                    Signup
                                </Button>
                            </motion.div>
                        </div>

                    </Fieldset>
                </Form>

                {/* 🎯 LOGIN LINK AREA */}
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