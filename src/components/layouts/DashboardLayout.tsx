import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidebarProvider defaultOpen>
          {children}
        </SidebarProvider>
      </div>
    </div>
  );
}