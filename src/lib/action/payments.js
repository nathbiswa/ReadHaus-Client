"use server";

import { revalidatePath } from "next/cache";

// @/lib/action/payments
export const getLibrarianDeliveries = async (userEmail) => {
    try {
        // 🟢 নিশ্চিত হোন process.env.NEXT_PUBLIC_API_URL এর মান আপনার .env ফাইলে ঠিকঠাক আছে (যেমন: http://localhost:5000)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${baseUrl}/api/librarian-deliveries?email=${userEmail}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Next.js Server Action Error:", error);
        return []; // ক্র্যাশ এড়াতে খালি অ্যারে রিটার্ন করুন
    }
};

/**
 * ২. লিব্রারিয়ানের অ্যাকশন অনুযায়ী স্ট্যাটাস পরিবর্তন করা
 */
export async function updateLibrarianDeliveryStatus(id, newStatus, token) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/api/librarian/deliveries/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus }) // ব্যাকএন্ডে প্রথম অক্ষর বড় হাতের হতে হবে (যেমন: "Dispatched")
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to update status");
        }

        revalidatePath("/dashboard/librarian/manage-deliveries");
        return { success: true, message: result.message };
    } catch (error) {
        console.error("Error in updateLibrarianDeliveryStatus action:", error.message);
        return { success: false, message: error.message };
    }
}

/**
 * ৩. আপনার ওল্ড সাকসেস পেজ অ্যাকশন (যা অলরেডি ঠিক আছে)
 */
export async function getDeliveryData(dataObject) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/deliveries/update-status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObject)
        });
        return await res.json();
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}