import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, ChevronLeft, ChevronRight, Monitor, Smartphone } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const MainLayout = () => {
  const isMobileDevice = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [forceMobileView, setForceMobileView] = useState(false);

  useEffect(() => {
    setForceMobileView(false);
  }, [isMobileDevice]);

  const isMobileView = forceMobileView || isMobileDevice;

  const DesktopSidebar = () => (
    <div className={`${collapsed ? 'w-16' : 'w-64'} border-r flex-shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && <h1 className="font-bold text-xl text-primary">ERP Flow</h1>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)} 
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        <Sidebar collapsed={collapsed} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-4 right-4 z-40 bg-white border rounded-md shadow-sm flex">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setForceMobileView(false)}
          className={!isMobileView ? "bg-muted" : ""}
        >
          <Monitor size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setForceMobileView(true)}
          className={isMobileView ? "bg-muted" : ""}
        >
          <Smartphone size={18} />
        </Button>
      </div>

      <div className="flex flex-1">
        {isMobileView ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40 lg:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar collapsed={false} />
            </SheetContent>
          </Sheet>
        ) : (
          <DesktopSidebar />
        )}

        <main className={`flex-1 bg-muted/30 ${isMobileView ? 'pt-14' : ''}`}>
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
