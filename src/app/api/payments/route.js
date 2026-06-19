import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { use } from 'react';

export async function POST() {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin');

        const sessionData = await auth.api.getSession({
            headers: await headers()
        });
        const user = sessionData?.user;

        const PRICE_ID = "price_1TjvHmP7aA1D1GSJUjulfVcc"

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email,
            line_items: [
                {
                    // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                    price: PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                priceId: PRICE_ID,
                userEmail: user?.email,
                userId: user?.id,

            },
            mode: 'subscription',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        });
        return NextResponse.redirect(session.url, 303)
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}