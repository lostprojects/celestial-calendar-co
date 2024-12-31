import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <SidebarProvider>
        <div className="flex h-full">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}