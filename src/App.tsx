
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AccountProvider } from "@/context/AccountContext";
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
import NewVendorForm from "@/pages/Vendors/NewVendorForm";
import BillsPage from "@/pages/Bills/BillsPage";
import ItemsPage from "@/pages/Items/ItemsPage";
import ItemDetailPage from "@/pages/Items/ItemDetailPage";
import NewItemForm from "@/pages/Items/NewItemForm";
import PurchaseOrdersPage from "@/pages/PurchaseOrders/PurchaseOrdersPage";
import PurchaseOrderDetailPage from "@/pages/PurchaseOrders/PurchaseOrderDetailPage";
import NewPurchaseOrderForm from "@/pages/PurchaseOrders/NewPurchaseOrderForm";
import AccountPage from "@/pages/Account/AccountPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AccountProvider>
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
                <Route path="vendors/new" element={<NewVendorForm />} />
                <Route path="vendors/:id" element={<VendorDetailPage />} />
                <Route path="bills" element={<BillsPage />} />
                <Route path="items" element={<ItemsPage />} />
                <Route path="items/new" element={<NewItemForm />} />
                <Route path="items/:id" element={<ItemDetailPage />} />
                <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="purchase-orders/new" element={<NewPurchaseOrderForm />} />
                <Route path="purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AccountProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
