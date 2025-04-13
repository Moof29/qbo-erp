
import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
