"use client";

import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { getAllBooks } from "@/lib/action/getbooks";
export default function BookSection() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            const response = await getAllBooks();

            // যদি রেসপন্সের ভেতর ডাটা অবজেক্ট আকারে থাকে, তবে response.data সেট হবে
            if (response && response.data) {
                setBooks(response.data);
            } else if (Array.isArray(response)) {
                setBooks(response); // ব্যাকআপ: যদি সরাসরি অ্যারে আসে
            }
            setLoading(false);
        };

        loadBooks();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading books...</div>;
    }

    return (
        <section className="py-12 px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
                Featured Books
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover the powerful features that make our platform fast, reliable,
                and easy to use for every book lover.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <BookCard
                        key={book._id}
                        title={book.title}
                        author={book.author}
                        description={book.description}
                        image={book.image}
                        category={book.category}
                        averageRating={book.averageRating}
                        totalReviews={book.totalReviews}
                        deliveryFee={book.deliveryFee}
                    />
                ))}
            </div>
        </section>
    );
}