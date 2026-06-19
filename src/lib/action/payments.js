'use server'


const baseBackednUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getDeliveryData = async (data) => {
    const res = await fetch(`${baseBackednUrl}/deliveries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const resData = await res.json();
    return resData;
}