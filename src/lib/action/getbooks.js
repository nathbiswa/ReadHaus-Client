const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllBooks = async () => {
    const res = await fetch(`${baseUrl}/api/books`, {
        method: "GET",
    });

    const result = await res.json();
    return result;
};