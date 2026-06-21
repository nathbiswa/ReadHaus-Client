import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }) {
    return (
        // 💡 এখানে flex-col (মোবাইলে উপর-নিচ) এবং md:flex-row (ডেক্সটপে পাশাপাশি) করা হলো
        <div className="flex flex-col md:flex-row bg-background min-h-screen">

            {/* সাইডবার বা মোবাইল টপবারের কন্টেইনার */}
            <div className="w-full md:w-auto">
                <DashboardSidebar />
            </div>

            {/* 🚀 মেইন কন্টেন্ট এরিয়া: মোবাইলে এটি নিজে থেকেই সাইডবার/টপবারের নিচে চলে আসবে */}
            <div className="flex-1 overflow-x-hidden">
                <main className="p-4 md:p-6 min-h-[calc(100vh-64px)] md:min-h-screen">
                    {children}
                </main>
                <ToastContainer />
            </div>

        </div>
    );
}