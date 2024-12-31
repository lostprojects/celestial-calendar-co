import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="pt-16">
      <SidebarProvider>
        <div className="flex h-[calc(100vh-4rem)]">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}