import { getDeliveryData } from '@/lib/action/payments'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Success({ searchParams }) {
    // searchParams-কে সেফলি এওয়েট করা হয়েছে
    const params = await searchParams;
    const session_id = params?.session_id;

    if (!session_id) {
        return redirect('/');
    }

    try {
        // স্ট্রাইপ থেকে সেশন ডাটা রিট্রিভ করা
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

        console.log('From book data metadata:', metadata);

        if (status === 'complete') {
            try {
                // 📌 এখানে status পরিবর্তন করে ছোট হাতের অক্ষরে "pending" রাখা হয়েছে
                await getDeliveryData({
                    ...metadata,
                    sessionId: session_id,
                    status: "pending"
                });
            } catch (dbError) {
                console.error("Database action failed but payment was completed safely:", dbError.message);
            }

            return (
                <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">

                        {/* সাকসেস মেসেজ */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-amber-400 tracking-tight">
                                Request Submitted Successfully!
                            </h1>
                            <p className="text-sm text-gray-400">
                                Thank you! Your delivery request has been successfully recorded and is currently pending review by the Admin and Librarian.
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
                                <p className="text-xs text-gray-500">Request Status</p>
                                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 w-fit px-2 py-0.5 rounded border border-amber-400/20">
                                    Pending
                                </p>
                            </div>
                        </div>

                        {/* ইমেইল ও সাপোর্ট ইনফো */}
                        <div className="space-y-3 text-sm text-gray-300 leading-relaxed bg-gray-950/30 p-4 rounded-xl border border-gray-800/40 text-left">
                            <p className="text-xs text-gray-400">
                                A confirmation updates will be shared with <span className="text-gray-200 font-medium font-mono">{customerEmail}</span> shortly.
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
        return redirect('/');
    }
}




// import { stripe } from '@/lib/stripe';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';

// export default async function Success({ searchParams }) {
//     // 📌 searchParams-কে সেফলি এওয়েট করা হয়েছে
//     const params = await searchParams;
//     const session_id = params?.session_id;

//     if (!session_id) {
//         return redirect('/');
//     }

//     try {
//         // 💳 স্ট্রাইপ থেকে সেশন ডাটা রিট্রিভ করা
//         const session = await stripe.checkout.sessions.retrieve(session_id, {
//             expand: ['line_items', 'payment_intent']
//         });

//         const status = session?.status;
//         const customerEmail = session?.customer_details?.email || "your email";
//         const metadata = session?.metadata || {};
//         const bookTitle = session?.line_items?.data[0]?.description || "Your Requested Book";

//         if (status === 'open') {
//             return redirect('/');
//         }

//         if (status === 'complete') {
//             const baseBackendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

//             try {
//                 // 📦 ডাটাবেজে (Express Backend) পাঠানোর অবজেক্ট তৈরি
//                 const deliveryPayload = {
//                     bookId: metadata.bookId,
//                     bookTitle: metadata.bookTitle,
//                     price: metadata.price,
//                     userEmail: metadata.userEmail,
//                     userName: metadata.userName,
//                     userId: metadata.userId,
//                     status: 'pending', // ব্যাকএন্ডে সেভ করার জন্য ছোট হাতের অক্ষরে 'pending'
//                     librarianEmail: metadata.librarianEmail,
//                     sessionId: session_id,
//                     createdAt: new Date()
//                 };

//                 // 🚀 ১. এক্সপ্রেস ব্যাকএন্ডে নতুনলি তৈরি ডেলিভারি রেকর্ড POST করা
//                 await fetch(`${baseBackendUrl}/api/deliveries`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(deliveryPayload)
//                 });

//                 // 🚀 ২. আপনার নির্দিষ্ট ব্যাকএন্ড রাউট অনুযায়ী বইয়ের স্ট্যাটাস "Pending Delivery" করা
//                 await fetch(`${baseBackendUrl}/api/books/${metadata.bookId}`, {
//                     method: 'PATCH',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ status: 'Pending Delivery' })
//                 });

//             } catch (dbError) {
//                 console.error("Database status sync failed but payment was safe:", dbError.message);
//             }

//             return (
//                 <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
//                     <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">

//                         {/* সাকসেস অ্যানিমেশন আইকন */}
//                         <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
//                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                             </svg>
//                         </div>

//                         {/* সাকসেস মেসেজ */}
//                         <div className="space-y-2">
//                             <h1 className="text-2xl font-bold text-amber-400 tracking-tight">
//                                 Request Submitted Successfully!
//                             </h1>
//                             <p className="text-sm text-gray-400">
//                                 Thank you! Your delivery request has been successfully recorded and is currently pending review by the Admin and Librarian.
//                             </p>
//                         </div>

//                         {/* অর্ডার সামারি */}
//                         <div className="bg-gray-950/50 border border-gray-800/60 rounded-2xl p-4 text-left space-y-3">
//                             <div className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">
//                                 Order Details
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-xs text-gray-500">Book Title</p>
//                                 <p className="text-sm font-semibold text-gray-200 truncate">{bookTitle}</p>
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-xs text-gray-500">Request Status</p>
//                                 <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 w-fit px-2 py-0.5 rounded border border-amber-400/20">
//                                     Pending
//                                 </p>
//                             </div>
//                         </div>

//                         {/* ইমেইল ও সাপোর্ট ইনফো */}
//                         <div className="space-y-3 text-sm text-gray-300 leading-relaxed bg-gray-950/30 p-4 rounded-xl border border-gray-800/40 text-left">
//                             <p className="text-xs text-gray-400">
//                                 A confirmation updates will be shared with <span className="text-gray-200 font-medium font-mono">{customerEmail}</span> shortly.
//                             </p>
//                             <p className="text-xs text-gray-500 border-t border-gray-800/60 pt-2">
//                                 If you have any questions, please email{' '}
//                                 <a href="mailto:orders@example.com" className="text-amber-400 hover:underline font-medium">
//                                     orders@example.com
//                                 </a>
//                             </p>
//                         </div>

//                         {/* হোম বাটন */}
//                         <div className="pt-2">
//                             <Link
//                                 href="/"
//                                 className="w-full block text-center py-3.5 px-6 bg-amber-400 text-gray-900 hover:bg-amber-500 font-bold rounded-xl uppercase text-xs transition-all shadow-lg shadow-amber-400/10"
//                             >
//                                 Go Back to Home
//                             </Link>
//                         </div>

//                     </div>
//                 </main>
//             );
//         }
//     } catch (stripeError) {
//         console.error("Stripe Session Retrieve Global Error:", stripeError);
//         return redirect('/');
//     }
// }