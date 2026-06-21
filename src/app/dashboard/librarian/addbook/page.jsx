
"use client";

import React from "react";
// HeroUI v3 কম্পোনেন্টসমূহ (Select সহ)
import {
    Form,
    Input,
    Button,
    Card,
    Label,
    TextArea,
    Select,
    ListBox,
    TextField
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

        // ২. সাধারণ টেক্সট ডাটা আলাদা করা (title, author, description, category, deliveryFee)
        const textData = Object.fromEntries(formData.entries());
        console.log("Form Text Data:", textData);

        // ৩. 🛠️ ফিক্স ১: সরাসরি formData থেকে আসল ফাইল অবজেক্টটি ধরুন (নামের ইনপুট অনুযায়ী)
        const imageFile = formData.get("image");

        if (!imageFile || imageFile.size === 0) {
            alert("Please select a valid cover image!");
            return;
        }

        try {
            // ৪. আসল ফাইল অবজেক্টটি আপলোড ফাংশনে পাঠানো হলো
            const uploadedImageUrl = await imageUpload(imageFile);
            console.log("Uploaded Image URL:", uploadedImageUrl);

            if (!uploadedImageUrl) {
                alert("Image upload failed! Please check your ImgBB API Key or network.");
                return;
            }

            // ৫. 🛠️ ফিক্স ২: ব্যাকএন্ডের জন্য ফাইনাল অবজেক্ট তৈরি
            const bookData = {
                title: textData.title,
                author: textData.author,
                description: textData.description,
                category: textData.category,
                deliveryFee: textData.deliveryFee, // ব্যাকএন্ড এটাকে parseFloat করবে
                image: uploadedImageUrl, // সরাসরি স্ট্রিং লিংকটি বসে যাবে
                librarian: name || "Unknown Librarian" // আপনার সেশনের নাম
            };

            // ৬. ব্যাকএন্ড এপিআই-তে ডাটা পাঠানো
            const result = await librarianAddBook(bookData);
            console.log('Books Added Successfully:', result);

            if (result?.success) {
                toast.success("Book added for approval successfully!");
                e.target.reset(); // ফর্মের সব ইনপুট খালি করে দেবে
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
                            {/* ১. বইয়ের নাম ইনপুট */}
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
                        {/* ৩. বইয়ের বর্ণনা ইনপুট */}
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

                            {/* ৪. ক্যাটাগরি সিলেক্ট (সিলেক্ট প্রবলেম ফিক্সড এবং name="category" যুক্ত) */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="book-category" className="text-xs uppercase tracking-wider font-bold text-slate-600">Category *</Label>
                                <Select
                                    id="book-category"
                                    name="category"
                                    className="w-full"
                                    placeholder="Select a category"
                                    variant="bordered"
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

                            {/* ৫. ডেলিভারি ফি ইনপুট */}
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
                        {/* ৬. ইমেজ আপলোড করার মডার্ন বক্স */}
                        {/* <div className="flex flex-col gap-2 w-full">
                            <Label className="text-xs uppercase tracking-wider font-bold text-slate-600">Cover Image</Label>

                            <div className="border-2 border-dashed border-indigo-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-indigo-50/10 hover:bg-indigo-50/30 hover:border-indigo-300 transition-all cursor-pointer min-h-[180px] group shadow-inner">
                                <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-200">

                                    <TextField className="w-full" type="file" variant="secondary">
                                        <Input type="file" name='image' />
                                    </TextField>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG (Max size 5MB)</p>
                                </div>
                            </div>
                        </div> */}
                        <div>
                            <label htmlFor="image">Upload Image</label>
                            <input type="file" name="image" id="image" />
                        </div>

                        {/* Submit Button */}
                        {/* ৭. আকর্ষণীয় সাবমিট বাটন */}
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