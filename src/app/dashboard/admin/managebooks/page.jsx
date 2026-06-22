'use client';
import { useState, useEffect } from "react";
import { Trash2, EyeOff, CheckCircle2, BookOpen } from "lucide-react";
import { adminService } from "@/lib/core/server";
import { toast, Toaster } from "react-hot-toast";

const ManageAllBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllBooks();
            setBooks(response.data || []);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to load books!");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (book) => {
        const newStatus = book.status === 'Published' ? 'Unpublished' : 'Published';
        try {
            await adminService.updateBook(book._id, { status: newStatus });
            setBooks(prev => prev.map(b => b._id === book._id ? { ...b, status: newStatus } : b));
            toast.success(`Book ${newStatus} successfully!`);
        } catch (error) {
            toast.error("Update failed!");
        }
    };

    const handleDeleteBook = async (id) => {
        if (confirm("Are you sure you want to delete this book?")) {
            try {
                await adminService.deleteBook(id);
                setBooks(prev => prev.filter(b => b._id !== id));
                toast.success("Book deleted successfully!");
            } catch (error) {
                toast.error("Delete failed!");
            }
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <Toaster position="top-right" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Manage All Books</h1>

                {/* Total Books Card */}
                <div className="mt-6 inline-flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-w-[200px]">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase">Total Books</p>
                        <h2 className="text-3xl font-black text-slate-800">{books.length}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Fee</th>
                            <th className="p-4">Librarian</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-400">Loading books...</td></tr>
                        ) : books.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-400">No books found.</td></tr>
                        ) : (
                            books.map(book => (
                                <tr key={book._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium">{book.title}</td>
                                    <td className="p-4 text-sm">{book.author}</td>
                                    <td className="p-4 text-sm">{book.category}</td>
                                    <td className="p-4 text-sm">${book.deliveryFee || 0}</td>
                                    <td className="p-4 text-sm">{book.librarianName || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${book.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button onClick={() => handleToggleStatus(book)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                                            {book.status === 'Published' ? <EyeOff size={16} /> : <CheckCircle2 size={16} />}
                                        </button>
                                        <button onClick={() => handleDeleteBook(book._id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAllBooks;