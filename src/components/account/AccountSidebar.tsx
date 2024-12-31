import { User, Settings, Lock, Mail } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const menuItems = [
    { id: "details", title: "My Details", icon: User },
    { id: "settings", title: "Settings", icon: Settings },
    { id: "security", title: "Security", icon: Lock },
    { id: "email", title: "Email", icon: Mail },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-4">
        <h1 className="text-xl font-serif">AstroChart</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    data-active={activeTab === item.id}
                    className="w-full px-6 py-2 text-base gap-4"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}