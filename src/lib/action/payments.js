"use server";

import { revalidatePath } from "next/cache";

/**
 * ১. লিব্রারিয়ানের আন্ডারে থাকা ডেলিভারি ডাটা গেট করা
 */
export const getLibrarianDeliveries = async (userEmail, token) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${baseUrl}/api/librarian/deliveries?email=${userEmail}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const resData = await response.json();

        return resData.data || resData.deliveries || [];
    } catch (error) {
        console.error("Server Action Error:", error);
        return [];
    }
};

/**
 * ২. লিব্রারিয়ানের অ্যাকশন অনুযায়ী স্ট্যাটাস পরিবর্তন করা
 */
export async function updateLibrarianDeliveryStatus(id, newStatus, token) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

        const res = await fetch(`${baseUrl}/api/librarian/deliveries/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: formattedStatus })
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed to update status");

        revalidatePath("/dashboard/librarian/manage-deliveries");
        return { success: true, message: result.message };
    } catch (error) {
        console.error("Update Action Error:", error.message);
        return { success: false, message: error.message };
    }
}

/**
 * ৩. আপনার ওল্ড সাকসেস পেজ অ্যাকশন (এটি আগের মতোই অক্ষত থাকবে)
 */
export async function getDeliveryData(dataObject) {
    try {
        // এখানেও নিরাপদ থাকার জন্য NEXT_PUBLIC_API_URL ব্যবহার করা ভালো
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

        const res = await fetch(`${baseUrl}/api/deliveries/update-status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObject)
        });
        return await res.json();
    } catch (error) {
        console.error("Error in getDeliveryData:", error);
        return { success: false };
    }
}