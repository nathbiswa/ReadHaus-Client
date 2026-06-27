'use client';
import { useState, useEffect } from "react";
import { Trash2, EyeOff, CheckCircle2, BookOpen, User, DollarSign, Folder, UserCheck } from "lucide-react";
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
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen w-full max-w-7xl mx-auto">
            <Toaster position="top-right" />

            {/* Top Bar Section */}
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Manage All Books</h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5">Maintain, publish, or remove books from the library.</p>
                </div>

                {/* Total Books Card */}
                <div className="flex items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-slate-200/60 shadow-sm min-w-[180px] sm:min-w-[200px] shrink-0">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <BookOpen size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Total Books</p>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-0.5">{books.length}</h2>
                    </div>
                </div>
            </div>

            {/* Main Content Handler */}
            {loading ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm font-medium">Loading books data...</p>
                </div>
            ) : books.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/60 shadow-sm font-medium text-sm">
                    No books found in the database.
                </div>
            ) : (
                <>
                    {/* ==================== ১. মোবাইল এবং ছোট স্ক্রিন লেআউট (Mobile View - Cards) ==================== */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {books.map(book => (
                            <div key={book._id} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-800 text-base leading-snug break-words">{book.title}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            <User size={12} className="text-slate-400" /> by {book.author}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full shrink-0 uppercase tracking-wide ${book.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                                        {book.status}
                                    </span>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Book Specs Grid */}
                                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Folder size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate">{book.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <DollarSign size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate font-semibold text-slate-700">${book.deliveryFee || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 col-span-2 min-w-0">
                                        <UserCheck size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate">Librarian: <strong className="font-medium text-slate-700">{book.librarian || 'librarian'}</strong></span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() => handleToggleStatus(book)}
                                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border ${book.status === 'Published' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                                    >
                                        {book.status === 'Published' ? (
                                            <>
                                                <EyeOff size={14} /> Unpublish Book
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={14} /> Publish Book
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteBook(book._id)}
                                        className="p-2.5 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition shadow-sm"
                                        aria-label="Delete Book"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ==================== ২. লার্জ এবং ডেক্সটপ মনিটর লেআউট (Desktop View - Fixed Table) ==================== */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 pl-6">Title</th>
                                    <th className="p-4">Author</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Fee</th>
                                    <th className="p-4">Librarian</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 pr-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {books.map(book => (
                                    <tr key={book._id} className="hover:bg-slate-50/40 transition-colors">
                                        <td className="p-4 pl-6 font-semibold text-slate-800 max-w-[220px] truncate">{book.title}</td>
                                        <td className="p-4 text-sm text-slate-600 max-w-[150px] truncate">{book.author}</td>
                                        <td className="p-4 text-sm text-slate-600 max-w-[130px] truncate">{book.category}</td>
                                        <td className="p-4 text-sm font-medium text-slate-700">${book.deliveryFee || 0}</td>
                                        <td className="p-4 text-sm text-slate-500 max-w-[140px] truncate">{book.librarianName || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border ${book.status === 'Published' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(book)}
                                                    className={`p-2 rounded-lg border transition ${book.status === 'Published' ? 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100' : 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100'}`}
                                                    title={book.status === 'Published' ? 'Unpublish' : 'Publish'}
                                                >
                                                    {book.status === 'Published' ? <EyeOff size={15} /> : <CheckCircle2 size={15} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="p-2 text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
                                                    title="Delete Permanent"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageAllBooks;