import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(request) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');

        // 🔒 Better Auth সেশন চেক
        const sessionData = await auth.api.getSession({
            headers: await headers()
        });
        const user = sessionData?.user;

        // 📥 HTML Form থেকে পাঠানো ডাটা রিসিভ করা
        const formData = await request.formData();
        console.log('Form Data', formData);
        const priceAmount = formData.get('price');
        const bookId = formData.get('bookId');
        const librarianEmail = formData.get('librarianEmail');
        const title = formData.get('title');
        const status = formData.get('status') || 'pending';
        console.log('BookId', bookId);

        // 💳 ১. স্ট্রাইপ ওয়ান-টাইম পেমেন্ট সেশন তৈরি (প্রথমে করতে হবে যেন session.id পাওয়া যায়)
        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email || undefined,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: title || "Book Purchase / Delivery",
                        },
                        unit_amount: Math.round(Number(priceAmount) * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookId: bookId,
                bookTitle: title,
                userEmail: user?.email || '',
                userId: user?.id || '',
                price: priceAmount,
                status: status,
                librarianEmail: librarianEmail,
            },
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/books/${bookId}`,
        });

        // 📝 ২. ডাটাবেজে (Express Backend) পাঠানোর অবজেক্ট তৈরি (sessionId সহ)
        const deliveryPayload = {
            bookId: bookId,
            bookTitle: title,
            price: priceAmount,
            userEmail: user?.email || formData.get('userEmail'),
            userName: user?.name || formData.get('userName'),
            userId: user?.id || formData.get('userId'),
            status: 'pending',
            librarianEmail: librarianEmail,
            sessionId: session.id, // 👈 এখন স্ট্রাইপ থেকে পাওয়া সেশন আইডি এখানে যুক্ত হলো!
            createdAt: new Date()
        };

        console.log('payload', deliveryPayload)


        // 🚀 ৩. আপনার এক্সপ্রেস ব্যাকএন্ডে ডাটা পাঠানো
        const baseBackendUrl = process.env.NEXT_PUBLIC_BASE_URL;
        try {
            await fetch(`${baseBackendUrl}/api/deliveries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deliveryPayload)
            });
        } catch (dbError) {
            console.error("Database Save Error but continuing to Stripe:", dbError);
        }

        // ৪. সরাসরি স্ট্রাইপ পেমেন্ট পেজে রিডাইরেক্ট
        return NextResponse.redirect(session.url, 303);

    } catch (err) {
        console.error("Stripe Error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}