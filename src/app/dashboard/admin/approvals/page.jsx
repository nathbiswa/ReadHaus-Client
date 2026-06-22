"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Chip, Spinner } from "@heroui/react";
import { CircleCheck } from "@gravity-ui/icons";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { adminService } from "@/lib/core/server";

export default function BookApprovalQueue() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // 🚀 Fetching data using service
    const fetchPendingBooks = async () => {
        try {
            const data = await adminService.getPendingBooks();
            setBooks(data || []);
        } catch (error) {
            toast.error("Failed to load data from the server!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingBooks();
    }, []);

    // 🎯 Function to approve a book
    const handleApprove = async (bookId) => {
        setActionLoading(bookId);
        try {
            await adminService.approveBook(bookId);
            toast.success("Book has been approved successfully!");
            setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        } catch (error) {
            toast.error("Failed to approve the book.");
        } finally {
            setActionLoading(null);
        }
    };

    // 🎯 Function to delete a book
    const handleDelete = async (bookId) => {
        if (!confirm("Are you sure you want to permanently delete this book?")) return;

        setActionLoading(bookId);
        try {
            await adminService.rejectBook(bookId);
            toast.success("Book has been permanently removed from the database.");
            setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        } catch (error) {
            toast.error("Failed to delete the book.");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Jun 20, 2026";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Spinner size="lg" color="secondary" label="Loading pending book submissions..." />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1e1b4b] tracking-tight">Book Approval Queue</h1>
                <p className="text-slate-500 text-sm mt-1">Review and approve new book submissions.</p>
            </div>

            {/* 📋 HeroUI Component Architecture */}
            <Table removeWrapper className="bg-white rounded-2xl shadow-sm">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Book Approval Queue Table">
                        <Table.Header>
                            {/* 💡 HeroUI requirement: Columns should return a function */}
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "TITLE"}</Table.Column>
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "AUTHOR"}</Table.Column>
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "CATEGORY"}</Table.Column>
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "FEE"}</Table.Column>
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "LIBRARIAN"}</Table.Column>
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "DATE"}</Table.Column>
                            <Table.Column className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4 text-center">{() => "ACTIONS"}</Table.Column>
                        </Table.Header>

                        <Table.Body>
                            {books.map((book) => (
                                <Table.Row key={book._id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                    <Table.Cell className="font-semibold text-slate-800 py-4">{book.title}</Table.Cell>
                                    <Table.Cell className="text-slate-600 py-4">{book.author}</Table.Cell>
                                    <Table.Cell className="py-4">
                                        <Chip size="sm" variant="flat" className="bg-purple-50 text-purple-600 font-semibold rounded-lg px-2">
                                            {book.category}
                                        </Chip>
                                    </Table.Cell>
                                    <Table.Cell className="font-medium text-slate-700 py-4">
                                        {book.deliveryFee === 0 || !book.deliveryFee ? "Free" : `$${Number(book.deliveryFee).toFixed(2)}`}
                                    </Table.Cell>
                                    <Table.Cell className="text-slate-600 py-4">{book.librarian || "Unknown"}</Table.Cell>
                                    <Table.Cell className="text-slate-500 text-sm py-4">{formatDate(book.createdAt)}</Table.Cell>
                                    <Table.Cell className="py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <Button
                                                size="sm"
                                                className="bg-[#6366f1] text-white font-medium px-4 rounded-xl shadow-md hover:bg-[#4f46e5]"
                                                startContent={actionLoading !== book._id && <CircleCheck className="w-4 h-4" />}
                                                isLoading={actionLoading === book._id}
                                                onClick={() => handleApprove(book._id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="border-red-100 text-red-500 hover:bg-red-50 font-medium px-4 rounded-xl"
                                                startContent={actionLoading !== book._id && <Trash2 className="w-4 h-4" />}
                                                isLoading={actionLoading === book._id}
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

            {/* 💡 Custom design for empty state */}
            {books.length === 0 && (
                <div className="text-center text-slate-400 py-12 bg-white rounded-b-2xl border-t border-slate-100 shadow-sm">
                    No new books are awaiting approval.
                </div>
            )}
        </div>
    );
}