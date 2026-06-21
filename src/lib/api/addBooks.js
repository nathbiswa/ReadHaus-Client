import { authClient } from "../auth-client";



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const librarianAddBook = async (bookData) => {
    const { data: token } = await authClient.token();

    const res = await fetch(`${BASE_URL}/librarian/addbook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token?.token}`
        },
        body: JSON.stringify(bookData)
    })

    const data = await res.json();
    return data;
}