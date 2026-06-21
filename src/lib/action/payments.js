"use server";

export async function getDeliveryData(dataObject) {
    const { sessionId, status } = dataObject;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/deliveries/update-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status })
    });

    return await res.json();
}