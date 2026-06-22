import { authClient } from "../auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = async () => {
    const { data: token } = await authClient.token();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token?.token) {
        headers['Authorization'] = `Bearer ${token.token}`;
    }

    return headers;
};

export const adminService = {
    getPendingBooks: async () => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/admin/book-approvals`, {
            method: 'GET',
            headers,
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch pending books");
        return await res.json();
    },

    approveBook: async (bookId) => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/admin/book-approve/${bookId}`, {
            method: "PATCH",
            headers,
        });
        if (!res.ok) throw new Error("Failed to approve the book");
        return await res.json();
    },

    rejectBook: async (bookId) => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/admin/book-reject/${bookId}`, {
            method: "DELETE",
            headers,
        });
        if (!res.ok) throw new Error("Failed to delete the book");
        return await res.json();
    },

    // এখানে '/api/admin/users' (plural) ব্যবহার করা হয়েছে
    getAllUsers: async () => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/admin/users`, {
            method: 'GET',
            headers,
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        return await res.json();
    },

    updateUserRole: async (userId, role) => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/admin/user-role/${userId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error("Failed to update user role");
        return await res.json();
    },

    deleteUser: async (userId) => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/admin/user/${userId}`, {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) throw new Error("Failed to delete user");
        return await res.json();
    },

    // adminService-এ যোগ করুন
    getAllBooks: async () => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/books`, { // আপনার ব্যাকএন্ডে GET /api/books আছে
            method: 'GET',
            headers,
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch books");
        return await res.json();
    },

    deleteBook: async (bookId) => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/books/${bookId}`, {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) throw new Error("Failed to delete book");
        return await res.json();
    },
    // adminService-এর ভেতরে এই মেথডটি যোগ করুন
    updateBook: async (bookId, updateData) => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_URL}/api/books/${bookId}`, {
            method: 'PATCH', // অথবা আপনার ব্যাকএন্ড অনুযায়ী PUT/PATCH
            headers,
            body: JSON.stringify(updateData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to update book status");
        }

        return await res.json();
    },
};



