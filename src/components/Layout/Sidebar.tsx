
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Building2, 
  Receipt, 
  Settings, 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  collapsed?: boolean;
}

const NavItem = ({ to, icon: Icon, children, collapsed }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-primary/10"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {!collapsed && <span>{children}</span>}
      </div>
    </NavLink>
  );
};

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      {!collapsed && (
        <div className="p-4 border-b">
          <h1 className="font-bold text-xl text-primary">ERP Flow Nexus</h1>
        </div>
      )}
      
      <nav className="flex-1 p-3 space-y-1">
        <NavItem to="/" icon={LayoutDashboard} collapsed={collapsed}>Dashboard</NavItem>
        <NavItem to="/customers" icon={Users} collapsed={collapsed}>Customers</NavItem>
        <NavItem to="/invoices" icon={FileText} collapsed={collapsed}>Invoices</NavItem>
        <NavItem to="/payments" icon={CreditCard} collapsed={collapsed}>Payments</NavItem>
        <NavItem to="/vendors" icon={Building2} collapsed={collapsed}>Vendors</NavItem>
        <NavItem to="/bills" icon={Receipt} collapsed={collapsed}>Bills</NavItem>
        
        <div className="pt-4 mt-4 border-t">
          <NavItem to="/settings" icon={Settings} collapsed={collapsed}>Settings</NavItem>
        </div>
      </nav>
      
      {!collapsed && (
        <div className="p-3 border-t flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="p-3 border-t flex justify-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            JD
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
