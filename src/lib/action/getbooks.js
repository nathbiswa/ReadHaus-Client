const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllBooks = async (filters = {}) => {
    try {
        // ১. ডিফল্ট ভ্যালু সহ ফিল্টার অবজেক্ট থেকে ডাটা নেওয়া হচ্ছে
        const { search = "", category = "", availability = "", maxFee = 100, page = 1, limit = 6 } = filters;

        // ২. URLSearchParams ব্যবহার করে কুয়েরি স্ট্রিং তৈরি করা হচ্ছে
        const queryParams = new URLSearchParams({
            search,
            category,
            availability,
            maxFee: maxFee.toString(),
            page: page.toString(),
            limit: limit.toString()
        });

        // ৩. ডাইনামিক ইউআরএল তৈরি (যেমন: /api/books?search=...&category=...)
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


// ১. নির্দিষ্ট একটি বইয়ের ডিটেইলস আনা
export const getSingleBook = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/api/books/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Book not found");
        return await res.json();
    } catch (error) {
        console.error("Error fetching single book:", error);
        return null;
    }
};

// ২. নির্দিষ্ট একটি বইয়ের সব রিভিউ আনা
export const getBookReviews = async (bookId) => {
    try {
        const res = await fetch(`${baseUrl}/api/reviews/${bookId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return await res.json();
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};