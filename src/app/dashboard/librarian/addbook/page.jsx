"use client";

import React, { useState } from "react";
// HeroUI v3 কম্পোনেন্টসমূহ
import {
    Form,
    Input,
    Button,
    Card,
    Label,
    TextArea,
    Select,
    ListBox
} from "@heroui/react";
import {
    Upload,
    BookOpen,
    Compass,
    HelpCircle,
    Atom,
    User
} from "lucide-react";
import { imageUpload } from "@/lib/action/imageUpload";
import { librarianAddBook } from "@/lib/api/addBooks";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function AddBookPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const name = user?.name;

    // 🛠️ ফিক্স ১: HeroUI কাস্টম সিলেক্টের ভ্যালু ট্র্যাক করার জন্য স্টেট
    const [selectedCategory, setSelectedCategory] = useState("");

    // ক্যাটাগরির ডাটা লিস্ট
    const categories = [
        { key: "Fiction", label: "Fiction", desc: "Story, novels, and literature", icon: <BookOpen className="w-4 h-4 text-indigo-500" /> },
        { key: "Non-Fiction", label: "Non-Fiction", desc: "Real-world facts and history", icon: <Compass className="w-4 h-4 text-emerald-500" /> },
        { key: "Mystery", label: "Mystery", desc: "Thriller and suspense books", icon: <HelpCircle className="w-4 h-4 text-amber-500" /> },
        { key: "Sci-Fi", label: "Sci-Fi", desc: "Science fiction and fantasy", icon: <Atom className="w-4 h-4 text-cyan-500" /> },
        { key: "Biography", label: "Biography", desc: "Life stories of individuals", icon: <User className="w-4 h-4 text-violet-500" /> }
    ];

    // ফর্ম সাবমিট হ্যান্ডেলার
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ১. ফর্ম ডাটা অবজেক্ট তৈরি
        const formData = new FormData(e.target);

        // ২. সাধারণ টেক্সট ডাটা আলাদা করা
        const textData = Object.fromEntries(formData.entries());

        // ৩. সরাসরি formData থেকে ফাইল অবজেক্টটি ধরা
        const imageFile = formData.get("image");

        if (!imageFile || imageFile.size === 0) {
            toast.error("Please select a valid cover image!");
            return;
        }

        try {
            // ৪. ফাইল আপলোড
            const uploadedImageUrl = await imageUpload(imageFile);

            if (!uploadedImageUrl) {
                toast.error("Image upload failed! Please check your ImgBB API Key.");
                return;
            }

            // ৫. 🛠️ ফিক্স ২: ব্যাকএন্ডের জন্য ফাইনাল ডাটা অবজেক্ট (ইমেইল এবং স্টেট ক্যাটাগরি সহ)
            const bookData = {
                title: textData.title,
                author: textData.author,
                description: textData.description,
                category: selectedCategory, // স্টেট থেকে আসল সিলেক্টেড ভ্যালু পাঠানো হলো
                deliveryFee: textData.deliveryFee,
                image: uploadedImageUrl,
                librarian: name || "Unknown Librarian",
                librarianEmail: user?.email || "", // 🔥 এখানে ইউজারের সেশন ইমেইল সরাসরি যুক্ত করা হলো
                status: "Pending Approval"
            };

            // ৬. ব্যাকএন্ড এপিআই-তে ডাটা পাঠানো
            const result = await librarianAddBook(bookData);

            if (result?.success) {
                toast.success("Book added for approval successfully!");
                e.target.reset(); // ফর্মের সব ইনপুট খালি করে দেবে
                setSelectedCategory(""); // ক্যাটাগরি স্টেট রিসেট
            } else {
                toast.error("Failed to add book to database!");
            }

        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("Something went wrong while adding the book.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-slate-50 to-slate-50 p-6 flex flex-col justify-start pb-16">

            {/* Header Section */}
            <div className="mb-8 text-center max-w-xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Add New Book
                </h1>
                <p className="text-slate-500 text-sm sm:text-base mt-2">
                    Fill in the details to list a new book. It will be pending approval from the admin.
                </p>
            </div>

            {/* Form Card Container */}
            <Card className="max-w-3xl w-full mx-auto shadow-xl shadow-slate-100/70 border border-slate-200/60 rounded-3xl bg-white overflow-hidden">
                <div className="p-6 sm:p-10">

                    <Form onSubmit={handleSubmit} className="flex flex-col gap-7">

                        {/* Title & Author Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            {/* ১. বইয়ের নাম ইনপুট */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="book-title" className="text-xs uppercase tracking-wider font-bold text-slate-600">Title *</Label>
                                <Input
                                    id="book-title"
                                    name="title"
                                    placeholder="e.g. The Alchemist"
                                    variant="bordered"
                                    className="w-full"
                                    classNames={{
                                        inputWrapper: "h-12 border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 rounded-xl transition-all"
                                    }}
                                    required
                                />
                            </div>

                            {/* ২. লেখকের নাম ইনপুট */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="book-author" className="text-xs uppercase tracking-wider font-bold text-slate-600">Author *</Label>
                                <Input
                                    id="book-author"
                                    name="author"
                                    placeholder="e.g. Paulo Coelho"
                                    variant="bordered"
                                    className="w-full"
                                    classNames={{
                                        inputWrapper: "h-12 border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 rounded-xl transition-all"
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="flex flex-col gap-2 w-full">
                            <Label htmlFor="book-desc" className="text-xs uppercase tracking-wider font-bold text-slate-600">Description *</Label>
                            <TextArea
                                id="book-desc"
                                name="description"
                                placeholder="Write a brief, catchy summary of the book..."
                                variant="bordered"
                                fullWidth
                                rows={4}
                                classNames={{
                                    inputWrapper: "border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 rounded-xl transition-all p-3"
                                }}
                                required
                            />
                        </div>

                        {/* Category & Delivery Fee Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">

                            {/* ৩. ক্যাটাগরি সিলেক্ট (onSelectionChange দিয়ে স্টেট কানেক্ট করা হয়েছে) */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="book-category" className="text-xs uppercase tracking-wider font-bold text-slate-600">Category *</Label>
                                <Select
                                    id="book-category"
                                    name="category"
                                    className="w-full"
                                    placeholder="Select a category"
                                    variant="bordered"
                                    selectedKeys={selectedCategory ? [selectedCategory] : []}
                                    onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0])}
                                    classNames={{
                                        trigger: "h-12 border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 rounded-xl transition-all bg-transparent"
                                    }}
                                    required
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox className="p-1.5">
                                            {categories.map((cat) => (
                                                <ListBox.Item id={cat.key} key={cat.key} textValue={cat.label} className="rounded-lg py-2">
                                                    <div className="flex items-center gap-2.5">
                                                        {cat.icon}
                                                        <span className="font-semibold text-slate-700">{cat.label}</span>
                                                    </div>
                                                    <span className="text-slate-400 text-xs block mt-0.5">{cat.desc}</span>
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            {/* ৪. ডেলিভারি ফি ইনপুট */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="delivery-fee" className="text-xs uppercase tracking-wider font-bold text-slate-600">Delivery Fee ($) *</Label>
                                <Input
                                    id="delivery-fee"
                                    name="deliveryFee"
                                    type="number"
                                    step="0.01"
                                    placeholder="4.99"
                                    variant="bordered"
                                    className="w-full"
                                    classNames={{
                                        inputWrapper: "h-12 border-slate-200 hover:border-indigo-400 focus-within:!border-indigo-600 rounded-xl transition-all"
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Image Upload Area Box */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="image" className="text-xs uppercase tracking-wider font-bold text-slate-600">Upload Cover Image *</Label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500">Click to upload book cover</p>
                                    </div>
                                    <input type="file" name="image" id="image" className="hidden" accept="image/*" required />
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-6 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200/80 transition-all mt-4 w-full text-base tracking-wide"
                            startContent={<Upload className="w-5 h-5" />}
                        >
                            Submit for Approval
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
}