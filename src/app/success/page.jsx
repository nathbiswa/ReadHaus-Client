import { getDeliveryData } from '@/lib/action/payments'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Success({ searchParams }) {
    // 🔒 ফিক্স ১: searchParams-কে প্রথমে সেফলি এওয়েট করে অবজেক্টে নেওয়া হয়েছে
    const params = await searchParams;
    const session_id = params?.session_id;

    if (!session_id) {
        return redirect('/');
    }

    try {
        // ২. স্ট্রাইপ থেকে সেশন ডাটা রিট্রিভ করা
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'payment_intent']
        });

        const status = session?.status;
        const customerEmail = session?.customer_details?.email || "your email";
        const metadata = session?.metadata || {};
        const bookTitle = session?.line_items?.data[0]?.description || "Your Requested Book";

        if (status === 'open') {
            return redirect('/');
        }


        console.log('From book data', metadata);

        if (status === 'complete') {
            // 🔒 ফিক্স ২: মঙ্গোডিবি বা সার্ভার অ্যাকশনের এরর হ্যান্ডেল করার জন্য আলাদা ট্রাই-ক্যাচ
            try {
                if (metadata && Object.keys(metadata).length > 0) {
                    await getDeliveryData({ ...metadata, sessionId: session_id, status: session?.status });
                }
            } catch (dbError) {
                // ডাটাবেজ একশনে কোনো ইন্টারনাল এরর হলেও যেন আপনার স্ক্রিন সাদা বা ক্র্যাশ না হয়
                console.error("Database action failed but payment was completed safely:", dbError);
            }

            return (
                <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">

                        {/* সাকসেস মেসেজ */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-emerald-400 tracking-tight">
                                Payment Successful!
                            </h1>
                            <p className="text-sm text-gray-400">
                                Thank you! Your delivery request has been successfully recorded for the Admin and Librarian.
                            </p>
                        </div>

                        {/* অর্ডার সামারি */}
                        <div className="bg-gray-950/50 border border-gray-800/60 rounded-2xl p-4 text-left space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">
                                Order Details
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">Book Title</p>
                                <p className="text-sm font-semibold text-gray-200 truncate">{bookTitle}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">Payment Status</p>
                                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 w-fit px-2 py-0.5 rounded border border-emerald-500/20">
                                    Paid
                                </p>
                            </div>
                        </div>

                        {/* ইমেইল ও সাপোর্ট ইনফো */}
                        <div className="space-y-3 text-sm text-gray-300 leading-relaxed bg-gray-950/30 p-4 rounded-xl border border-gray-800/40 text-left">
                            <p className="text-xs text-gray-400">
                                A confirmation email will be sent to <span className="text-gray-200 font-medium font-mono">{customerEmail}</span> shortly.
                            </p>
                            <p className="text-xs text-gray-500 border-t border-gray-800/60 pt-2">
                                If you have any questions, please email{' '}
                                <a href="mailto:orders@example.com" className="text-amber-400 hover:underline font-medium">
                                    orders@example.com
                                </a>
                            </p>
                        </div>

                        {/* হোম বাটন */}
                        <div className="pt-2">
                            <Link
                                href="/"
                                className="w-full block text-center py-3.5 px-6 bg-amber-400 text-gray-900 hover:bg-amber-500 font-bold rounded-xl uppercase text-xs transition-all shadow-lg shadow-amber-400/10"
                            >
                                Go Back to Home
                            </Link>
                        </div>

                    </div>
                </main>
            );
        }
    } catch (stripeError) {
        console.error("Stripe Session Retrieve Global Error:", stripeError);
        // স্ট্রাইপ কি বা সেশনে বড় কোনো সমস্যা হলে সরাসরি হোমে রিডাইরেক্ট করবে, স্ক্রিন ভাঙবে না
        return redirect('/');
    }
}