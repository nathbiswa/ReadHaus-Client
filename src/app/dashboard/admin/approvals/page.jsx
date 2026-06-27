"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Chip, Spinner } from "@heroui/react";
import { CircleCheck } from "@gravity-ui/icons";
import { Trash2, Calendar, User, DollarSign, Folder } from "lucide-react";
import { toast } from "react-toastify";
import { adminService } from "@/lib/core/server";

export default function BookApprovalQueue() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState({ id: null, type: null });

    const fetchPendingBooks = async () => {
        try {
            setLoading(true);
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

    const handleApprove = async (bookId) => {
        setAction({ id: bookId, type: "approve" });
        try {
            await adminService.approveBook(bookId);
            toast.success("Book has been approved successfully!");
            setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        } catch (error) {
            console.error("Approve error detail:", error);
            toast.error("Failed to approve the book.");
        } finally {
            setAction({ id: null, type: null });
        }
    };

    const handleDelete = async (bookId) => {
        if (!confirm("Are you sure you want to permanently delete this book?")) return;

        setAction({ id: bookId, type: "delete" });
        try {
            await adminService.rejectBook(bookId);
            toast.success("Book has been permanently removed.");
            setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        } catch (error) {
            console.error("Delete error detail:", error);
            toast.error("Failed to delete the book.");
        } finally {
            setAction({ id: null, type: null });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Jun 24, 2026";
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
        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1e1b4b] tracking-tight">Book Approval Queue</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Review and approve new book submissions.</p>
            </div>

            {/* ==================== ১. মোবাইল ভিউ (Mobile View - Card Layout) ==================== */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {books.map((book) => (
                    <div key={book._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <div>
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-slate-800 text-base leading-snug">{book.title}</h3>
                                <Chip size="sm" variant="flat" className="bg-purple-50 text-purple-600 font-semibold rounded-lg shrink-0">
                                    {book.category}
                                </Chip>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">by {book.author}</p>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">Fee: <strong>{book.deliveryFee === 0 || !book.deliveryFee ? "Free" : `$${Number(book.deliveryFee).toFixed(2)}`}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">Librarian: {book.librarian || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 col-span-2 min-w-0">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Submitted: {formatDate(book.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 w-full">
                            <Button
                                size="sm"
                                className="bg-[#6366f1] text-white font-medium rounded-xl shadow-md hover:bg-[#4f46e5] flex-1 py-4 text-xs"
                                startContent={!(action.id === book._id && action.type === "approve") && <CircleCheck className="w-3.5 h-3.5" />}
                                isLoading={action.id === book._id && action.type === "approve"}
                                disabled={action.id === book._id && action.type === "delete"}
                                onClick={() => handleApprove(book._id)}
                            >
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="bordered"
                                className="border-red-100 text-red-500 hover:bg-red-50 font-medium rounded-xl flex-1 py-4 text-xs"
                                startContent={!(action.id === book._id && action.type === "delete") && <Trash2 className="w-3.5 h-3.5" />}
                                isLoading={action.id === book._id && action.type === "delete"}
                                disabled={action.id === book._id && action.type === "approve"}
                                onClick={() => handleDelete(book._id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ==================== ২. ডেস্কটপ ও ট্যাবলেট ভিউ (Desktop & Tablet View) ==================== */}
            <div className="hidden md:block">
                <Table removeWrapper className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Book Approval Queue Table">
                            <Table.Header>
                                <Table.Column key="title" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "TITLE"}</Table.Column>
                                <Table.Column key="author" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "AUTHOR"}</Table.Column>
                                <Table.Column key="category" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "CATEGORY"}</Table.Column>
                                <Table.Column key="fee" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "FEE"}</Table.Column>
                                <Table.Column key="librarian" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "LIBRARIAN"}</Table.Column>
                                <Table.Column key="date" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4">{() => "DATE"}</Table.Column>
                                <Table.Column key="actions" className="bg-[#f8fafc] text-slate-400 font-semibold text-xs py-4 text-center">{() => "ACTIONS"}</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                {books.map((book) => (
                                    <Table.Row key={book._id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                        <Table.Cell className="font-semibold text-slate-800 py-4 max-w-[200px] truncate">{book.title}</Table.Cell>
                                        <Table.Cell className="text-slate-600 py-4 max-w-[150px] truncate">{book.author}</Table.Cell>
                                        <Table.Cell className="py-4">
                                            <Chip size="sm" variant="flat" className="bg-purple-50 text-purple-600 font-semibold rounded-lg px-2">
                                                {book.category}
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell className="font-medium text-slate-700 py-4">
                                            {book.deliveryFee === 0 || !book.deliveryFee ? "Free" : `$${Number(book.deliveryFee).toFixed(2)}`}
                                        </Table.Cell>
                                        <Table.Cell className="text-slate-600 py-4 max-w-[120px] truncate">{book.librarian || "Unknown"}</Table.Cell>
                                        <Table.Cell className="text-slate-500 text-sm py-4 whitespace-nowrap">{formatDate(book.createdAt)}</Table.Cell>
                                        <Table.Cell className="py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <Button
                                                    size="sm"
                                                    className="bg-[#6366f1] text-white font-medium px-4 rounded-xl shadow-md hover:bg-[#4f46e5]"
                                                    startContent={!(action.id === book._id && action.type === "approve") && <CircleCheck className="w-4 h-4" />}
                                                    isLoading={action.id === book._id && action.type === "approve"}
                                                    disabled={action.id === book._id && action.type === "delete"}
                                                    onClick={() => handleApprove(book._id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    className="border-red-100 text-red-500 hover:bg-red-50 font-medium px-4 rounded-xl"
                                                    startContent={!(action.id === book._id && action.type === "delete") && <Trash2 className="w-4 h-4" />}
                                                    isLoading={action.id === book._id && action.type === "delete"}
                                                    disabled={action.id === book._id && action.type === "approve"}
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
            </div>

            {/* ==================== ৩. ফাকা বা এম্পটি স্টেট (Empty State) ==================== */}
            {books.length === 0 && (
                <div className="text-center text-slate-400 py-12 bg-white rounded-2xl border border-slate-100 shadow-sm mt-2">
                    No new books are awaiting approval.
                </div>
            )}
        </div>
    );
}