// ১. একদম উপরে সেফলি গ্লোবাল baseUrl ডিফাইন করা হলো যাতে সব ফাংশন এটা পায়
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// ================= GET ALL BOOKS (WITH FILTERS) =================
export const getAllBooks = async (filters = {}) => {
    try {
        // ডিফল্ট ভ্যালু সহ ফিল্টার অবজেক্ট থেকে ডাটা নেওয়া হচ্ছে
        const { search = "", category = "", availability = "", maxFee = 100, page = 1, limit = 6 } = filters;

        // URLSearchParams ব্যবহার করে কুয়েরি স্ট্রিং তৈরি করা হচ্ছে
        const queryParams = new URLSearchParams({
            search,
            category,
            availability,
            maxFee: maxFee.toString(),
            page: page.toString(),
            limit: limit.toString()
        });

        // ডাইনামিক ইউআরএল তৈরি
        const res = await fetch(`${baseUrl}/api/books?${queryParams.toString()}`, {
            method: "GET",
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error("Failed to fetch books from server");
        }

        const result = await res.json();
        return result;

    } catch (error) {
        console.error("Error in getAllBooks action:", error);
        return { success: false, data: [], totalPages: 1 };
    }
};


// ================= GET SINGLE BOOK DETAILS (WITH USER PURCHASE CHECK) =================
export const getSingleBook = async (id, email = "") => {
    try {
        // এক্সপ্রেস ব্যাকএন্ড এপিআই-তে কুয়েরি প্যারামিটার হিসেবে ইমেইল জুড়ে দেওয়া হচ্ছে
        const res = await fetch(`${baseUrl}/api/books/${id}?email=${email}`, {
            cache: 'no-store' // রিয়েল-টাইম ডাটা আপডেটের জন্য ক্যাশিং বন্ধ রাখা হলো
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error in getSingleBook action:", error);
        return null;
    }
};


// ================= GET BOOK REVIEWS =================
export const getBookReviews = async (bookId) => {
    try {
        const res = await fetch(`${baseUrl}/api/reviews/${bookId}`, {
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Failed to fetch reviews");
        return await res.json();
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};