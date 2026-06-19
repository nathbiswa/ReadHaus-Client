import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Mail, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react'

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const status = session.status
    const customerEmail = session.customer_details?.email
    const bookTitle = session.line_items?.data[0]?.description || "Your Book"

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        return (
            <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 md:p-8">
                <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden space-y-6">

                    {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* সাকসেস আইকন অ্যানিমেশন সহ */}
                    <div className="flex justify-center">
                        <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 animate-pulse">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                    </div>

                    {/* হেডার টেক্সট */}
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-tight">
                            Payment Successful!
                        </h1>
                        <p className="text-sm text-gray-400">
                            Thank you for your order. Your delivery request has been recorded.
                        </p>
                    </div>

                    {/* অর্ডার সামারি কার্ড */}
                    <div className="bg-gray-950/50 border border-gray-800/60 rounded-2xl p-4 text-left space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">
                            <ShoppingBag className="w-4 h-4 text-amber-400" /> Order Details
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

                    {/* নোটিফিকেশন ইনফো */}
                    <div className="space-y-3 text-sm text-gray-300 leading-relaxed bg-gray-950/30 p-4 rounded-xl border border-gray-800/40">
                        <p className="flex items-start gap-2.5 text-xs text-gray-400 text-left">
                            <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                                A confirmation email will be sent to <span className="text-gray-200 font-medium font-mono">{customerEmail}</span> shortly.
                            </span>
                        </p>
                        <p className="text-xs text-left text-gray-500 border-t border-gray-800/60 pt-2">
                            For any queries, contact us at{' '}
                            <a href="mailto:orders@example.com" className="text-amber-400 hover:underline font-medium">
                                orders@example.com
                            </a>
                        </p>
                    </div>

                    {/* ড্যাশবোর্ড বা হোমে যাওয়ার অ্যাকশন বাটন */}
                    <div className="pt-2">
                        <Link
                            href="/"
                            className="w-full py-3.5 px-6 bg-amber-400 text-gray-900 hover:bg-amber-500 font-bold rounded-xl uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/10 group"
                        >
                            Go Back to Home
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* সিকিউরিটি ব্যাজ */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secured by Stripe Connect
                    </div>

                </div>
            </main>
        )
    }
}