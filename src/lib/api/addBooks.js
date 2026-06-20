const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const librarianAddBook = async (bookData) => {
    const res = await fetch(`${BASE_URL}/librarian/addbook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData)
    })

    const data = await res.json();
    return data;
}