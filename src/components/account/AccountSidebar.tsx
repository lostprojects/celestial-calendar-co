import { User, Settings, Lock, Mail } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    data-active={activeTab === item.id}
                  >
                    <item.icon className="h-4 w-4" />
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