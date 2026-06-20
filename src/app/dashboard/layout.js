import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex bg-background">
            <div className="flex flex-1 overflow-hidden">
                <div className="min-h-screen">
                    <DashboardSidebar />
                </div>
                <div className="flex-1 overflow-y-hidden">
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}