
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NavItem = ({ to, icon: Icon, children }: { 
  to: string; 
  icon: React.ElementType;
  children: React.ReactNode;
}) => {
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
      <Icon size={18} />
      <span>{children}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 border-r flex-shrink-0 h-screen sticky top-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h1 className="font-bold text-xl text-primary">ERP Flow Nexus</h1>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/" icon={LayoutDashboard}>Dashboard</NavItem>
          <NavItem to="/customers" icon={Users}>Customers</NavItem>
          <NavItem to="/invoices" icon={FileText}>Invoices</NavItem>
          <NavItem to="/payments" icon={CreditCard}>Payments</NavItem>
          <NavItem to="/vendors" icon={Building2}>Vendors</NavItem>
          <NavItem to="/bills" icon={Receipt}>Bills</NavItem>
          
          <div className="pt-4 mt-4 border-t">
            <NavItem to="/settings" icon={Settings}>Settings</NavItem>
          </div>
        </nav>
        
        <div className="p-3 border-t flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
