
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import MainLayout from "@/components/Layout/MainLayout";
import AuthPage from "@/pages/Auth/AuthPage";
import Dashboard from "@/pages/Dashboard";
import CustomersPage from "@/pages/Customers/CustomersPage";
import CustomerDetailPage from "@/pages/Customers/CustomerDetailPage";
import CustomerForm from "@/pages/Customers/CustomerForm";
import InvoicesPage from "@/pages/Invoices/InvoicesPage";
import InvoiceDetailPage from "@/pages/Invoices/InvoiceDetailPage";
import NewInvoiceForm from "@/pages/Invoices/NewInvoiceForm";
import PaymentsPage from "@/pages/Payments/PaymentsPage";
import VendorsPage from "@/pages/Vendors/VendorsPage";
import VendorDetailPage from "@/pages/Vendors/VendorDetailPage";
import BillsPage from "@/pages/Bills/BillsPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/new" element={<CustomerForm />} />
              <Route path="customers/:id" element={<CustomerDetailPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="invoices/new" element={<NewInvoiceForm />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="vendors/:id" element={<VendorDetailPage />} />
              <Route path="bills" element={<BillsPage />} />
              <Route path="settings" element={
                <ProtectedRoute requiredRole="admin">
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
