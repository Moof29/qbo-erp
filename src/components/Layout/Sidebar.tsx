
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
import { useAuth } from '@/context/AuthContext';
import UserProfile from '@/components/Auth/UserProfile';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  collapsed?: boolean;
  requiredRole?: 'admin' | 'sales_rep' | 'warehouse';
}

const NavItem = ({ to, icon: Icon, children, collapsed, requiredRole }: NavItemProps) => {
  const { hasRole } = useAuth();
  
  // If this item requires a specific role and user doesn't have it, don't show the item
  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

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
  const { user } = useAuth();
  
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
          <NavItem to="/settings" icon={Settings} collapsed={collapsed} requiredRole="admin">Settings</NavItem>
        </div>
      </nav>
      
      {user ? (
        !collapsed ? (
          <div className="p-3 border-t">
            <UserProfile />
          </div>
        ) : (
          <div className="p-3 border-t flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Sidebar;
