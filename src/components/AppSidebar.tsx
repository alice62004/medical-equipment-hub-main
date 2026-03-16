import {
  LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine,
  Share2, Truck, Building2, BarChart3, Activity, Shield, ChartPie, User, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth, getRoleName } from "@/lib/auth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const baseMenuItems = [
  { title: "Tổng quan", url: "/", icon: LayoutDashboard, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Thiết bị", url: "/thiet-bi", icon: Package, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Nhập kho", url: "/nhap-kho", icon: ArrowDownToLine, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Xuất kho", url: "/xuat-kho", icon: ArrowUpFromLine, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Cấp phát", url: "/cap-phat", icon: Share2, roles: ["admin", "nhanvien_kho", "quanly"] },
{ title: "Nhà cung cấp", url: "/nha-cung-cap", icon: Truck, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Khoa", url: "/khoa", icon: Building2, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Tồn kho", url: "/ton-kho", icon: BarChart3, roles: ["admin", "nhanvien_kho", "quanly"] },
  { title: "Thống kê", url: "/thong-ke", icon: ChartPie, roles: ["admin", "quanly"] },
  { title: "Phân quyền", url: "/phan-quyen", icon: Shield, roles: ["admin"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = baseMenuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-sidebar-primary-foreground truncate">MedEquip</h2>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">Quản lý vật tư y tế</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
            {!collapsed && "Menu chính"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3 space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/profile" className="hover:bg-sidebar-accent/50 transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                  <User className="mr-2 h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>Trang cá nhân</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {!collapsed && user && (
            <div className="px-2 py-1.5 text-[10px] text-sidebar-foreground/50 truncate">
              {user.name} • {getRoleName(user.role)}
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {!collapsed && "Đăng xuất"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
