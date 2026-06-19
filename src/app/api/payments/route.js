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
        const priceAmount = formData.get('price'); // ফ্রন্টএন্ড থেকে বইয়ের দাম বা ফি আসবে (সংখ্যা)
        const bookId = formData.get('bookId');
        const title = formData.get('title');
        const status = formData.get('status') || 'pending';

        // 💳 স্ট্রাইপ ওয়ান-টাইম পেমেন্ট সেশন তৈরি
        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email || undefined,
            line_items: [
                {
                    price_data: {
                        currency: 'usd', // আপনার প্রয়োজনীয় কারেন্সি (যেমন: usd, bdt ইত্যাদি)
                        product_data: {
                            name: title || "Book Purchase / Delivery", // পেমেন্ট পেজে এই নামটি দেখাবে
                        },
                        // স্ট্রাইপ সেন্ট (cents) হিসেবে হিসাব করে, তাই ১০০ দিয়ে গুণ করতে হবে ($15 = 1500 cents)
                        unit_amount: Math.round(Number(priceAmount) * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                formData: formData,
                bookId: bookId,
                bookTitle: title,
                userEmail: user?.email,
                userId: user?.id,
                price: priceAmount,
                status: status,

            },
            mode: 'payment', // 👈 ওয়ান-টাইম পেমেন্টের জন্য এটি 'payment' থাকবে
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/books/${bookId}`,
        });

        // সরাসরি স্ট্রাইপ ওয়ান-টাইম পেমেন্ট পেজে রিডাইরেক্ট
        return NextResponse.redirect(session.url, 303);

    } catch (err) {
        console.error("Stripe Error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}