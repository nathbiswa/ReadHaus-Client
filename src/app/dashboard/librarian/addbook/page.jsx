"use client";

import React, { useState, useRef } from "react";
// HeroUI v3 কম্পোনেন্টসমূহ
import { Form, Input, Button, Select, ListBox, Card, Label, TextArea } from "@heroui/react";
import {
    Upload,
    BookOpen,
    Compass,
    HelpCircle,
    Atom,
    User,
    X // ইমেজ ডিলিট করার জন্য ক্রস আইকন
} from "lucide-react";
import { toast } from "react-toastify";

export default function AddBookPage() {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null); // 👈 লুকানো ইনপুট ফাইলকে ট্রিগার করার জন্য রিফ

    // ইমেজ ফাইলের জন্য আলাদা স্টেট
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        category: "",
        deliveryFee: "",
        librarian: "Librarian One"
    });

    const categories = [
        { key: "Fiction", label: "Fiction", icon: <BookOpen className="w-4 h-4 text-indigo-500" /> },
        { key: "Non-Fiction", label: "Non-Fiction", icon: <Compass className="w-4 h-4 text-emerald-500" /> },
        { key: "Mystery", label: "Mystery", icon: <HelpCircle className="w-4 h-4 text-amber-500" /> },
        { key: "Sci-Fi", label: "Sci-Fi", icon: <Atom className="w-4 h-4 text-cyan-500" /> },
        { key: "Biography", label: "Biography", icon: <User className="w-4 h-4 text-violet-500" /> }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (keys) => {
        const selectedKey = Array.from(keys)[0];
        setFormData((prev) => ({ ...prev, category: selectedKey }));
    };

    // 📸 ফাইল সিলেক্ট এবং প্রিভিউ হ্যান্ডেলার
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("ফাইলের সাইজ ৫ মেগাবাইটের কম হতে হবে!");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // প্রিভিউ লিংক জেনারেট
        }
    };

    // 🛑 সিলেক্ট করা ইমেজ রিমুভ করার ফাংশন
    const removeImage = (e) => {
        e.stopPropagation(); // ড্র্যাগ বক্সে ক্লিক ইভেন্ট আটকানোর জন্য
        setImageFile(null);
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // 📤 ড্র্যাগ ওভার হ্যান্ডেলার
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // 📥 ড্রপ হ্যান্ডেলার (যখন কেউ মাউস দিয়ে ছবি ছেড়ে দেবে)
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("ফাইলের সাইজ ৫ মেগাবাইটের কম হতে হবে!");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            toast.error("অনুগ্রহ করে শুধু JPG বা PNG ইমেজ ফাইল ড্রপ করুন।");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // যদি আপনার ব্যাকএন্ডে ইমেজ পাঠাতে হয়, তাহলে FormData ব্যবহার করতে হবে
            const data = new FormData();
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("deliveryFee", formData.deliveryFee);
            data.append("librarian", formData.librarian);
            if (imageFile) {
                data.append("coverImage", imageFile); // ব্যাকএন্ডের আপলোড ফিল্ড নেম
            }

            const res = await fetch("http://localhost:5000/api/librarian/add-book", {
                method: "POST",
                // ⚠️ নোট: FormData পাঠালে "Content-Type" হেডার ম্যানুয়ালি সেট করতে হয় না, ব্রাউজার নিজে করে নেয়।
                body: data,
            });

            if (res.ok) {
                toast.success("বইটি সফলভাবে জমা হয়েছে এবং এডমিন অনুমোদনের অপেক্ষায় আছে।");
                setFormData({ title: "", author: "", description: "", category: "", deliveryFee: "", librarian: "Librarian One" });
                setImageFile(null);
                setImagePreview("");
            } else {
                toast.error("বইটি সাবমিট করা সম্ভব হয়নি।");
            }
        } catch (error) {
            toast.error("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto flex flex-col justify-start pb-10 lg:mb-[50px]">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#1e1b4b] tracking-tight">Add New Book</h1>
                <p className="text-slate-500 text-sm mt-1">Fill in the details to list a new book. It will be pending approval.</p>
            </div>

            {/* Form Card Container */}
            <Card className="shadow-sm border border-slate-100 rounded-2xl bg-white mb-6">
                <div className="p-4 sm:p-6">
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Title & Author Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="book-title" className="text-sm font-semibold text-slate-700">Title *</Label>
                                <Input
                                    id="book-title"
                                    name="title"
                                    placeholder="Book title"
                                    variant="bordered"
                                    className="w-full"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="book-author" className="text-sm font-semibold text-slate-700">Author *</Label>
                                <Input
                                    id="book-author"
                                    name="author"
                                    placeholder="Author name"
                                    variant="bordered"
                                    className="w-full"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <Label htmlFor="book-desc" className="text-sm font-semibold text-slate-700">Description *</Label>
                            <TextArea
                                id="book-desc"
                                name="description"
                                placeholder="Brief description of the book..."
                                variant="bordered"
                                fullWidth
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Category & Delivery Fee Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="book-category" className="text-sm font-semibold text-slate-700">Category *</Label>
                                <Select
                                    id="book-category"
                                    className="w-full"
                                    placeholder="Select one"
                                    variant="bordered"
                                    selectedKeys={formData.category ? [formData.category] : []}
                                    onSelectionChange={handleCategoryChange}
                                    required
                                >
                                    <Select.Trigger>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            {categories.map((cat) => (
                                                <ListBox.Item id={cat.key} key={cat.key} textValue={cat.label}>
                                                    <div className="flex items-center gap-2.5 py-0.5">
                                                        {cat.icon}
                                                        <span className="text-sm text-slate-700">{cat.label}</span>
                                                    </div>
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </div>

                            {/* Delivery Fee Input */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="delivery-fee" className="text-sm font-semibold text-slate-700">Delivery Fee ($) *</Label>
                                <Input
                                    id="delivery-fee"
                                    name="deliveryFee"
                                    type="number"
                                    step="0.01"
                                    placeholder="4.99"
                                    variant="bordered"
                                    className="w-full"
                                    value={formData.deliveryFee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* 🛠️ সচল করা ড্র্যাগ অ্যান্ড ড্রপ এরিয়া উইথ প্রিভিউ */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <Label className="text-sm font-semibold text-slate-700">Cover Image</Label>

                            {/* হাইড করা রিয়েল ফাইল ইনপুট */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg"
                                className="hidden"
                            />

                            <div
                                onClick={() => fileInputRef.current.click()} // বক্সে ক্লিক করলে ফাইল ওপেন হবে
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative min-h-[160px]"
                            >
                                {imagePreview ? (
                                    /* ইমেজের প্রিভিউ দেখানোর অংশ */
                                    <div className="relative w-full max-w-[120px] aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                                        <img
                                            src={imagePreview}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* ইমেজ ডিলিট করার বাটন */}
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    /* ফাইল না থাকলে ডিফল্ট আপলোড ডিজাইন */
                                    <>
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                            <Upload className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 5MB</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="bg-[#312e81] text-white font-semibold py-6 rounded-xl shadow-md hover:bg-[#1e1b4b] mt-2 w-full text-base"
                            isLoading={loading}
                            startContent={!loading && <Upload className="w-5 h-5" />}
                        >
                            Submit for Approval
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
}