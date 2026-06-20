import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Footer from "@/components/Footer";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen bg-background">
            <div className="flex flex-1 overflow-hidden">
                <DashboardSidebar />
                <div className="flex-1 overflow-y-hidden">
                    <main className="m-4">

                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}