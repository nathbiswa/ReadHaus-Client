"use client";

import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { getAllBooks } from "@/lib/action/getbooks";
// import { getAllBooks } from "@/lib/getAllBooks";

export default function BookSection() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            const data = await getAllBooks();
            setBooks(data);
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