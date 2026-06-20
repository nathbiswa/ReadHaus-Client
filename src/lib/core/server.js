// 🌐 আপনার ব্যাকএন্ডের বেস URL
const BASE_URL = "http://localhost:5000/api/admin";

export const adminService = {
    // 🚀 ১. pending বইয়ের তালিকা নিয়ে আসা
    getPendingBooks: async () => {
        try {
            const res = await fetch(`${BASE_URL}/book-approvals`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error("ডাটা লোড করতে ব্যর্থ হয়েছে");
            return await res.json();
        } catch (error) {
            console.error("getPendingBooks Error:", error);
            throw error;
        }
    },

    // 🎯 ২. বই অনুমোদন করা
    approveBook: async (bookId) => {
        try {
            const res = await fetch(`${BASE_URL}/book-approve/${bookId}`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("অনুমোদন করা সম্ভব হয়নি");
            return await res.json();
        } catch (error) {
            console.error("approveBook Error:", error);
            throw error;
        }
    },

    // 🗑️ ৩. বই পুরোপুরি ডিলিট করা
    rejectBook: async (bookId) => {
        try {
            const res = await fetch(`${BASE_URL}/book-reject/${bookId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("ডিলিট করা সম্ভব হয়নি");
            return await res.json();
        } catch (error) {
            console.error("rejectBook Error:", error);
            throw error;
        }
    }
};