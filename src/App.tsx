
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/Customers/CustomersPage";
import CustomerDetailPage from "./pages/Customers/CustomerDetailPage";
import InvoicesPage from "./pages/Invoices/InvoicesPage";
import InvoiceDetailPage from "./pages/Invoices/InvoiceDetailPage";
import NewInvoiceForm from "./pages/Invoices/NewInvoiceForm";
import PaymentsPage from "./pages/Payments/PaymentsPage";
import VendorsPage from "./pages/Vendors/VendorsPage";
import VendorDetailPage from "./pages/Vendors/VendorDetailPage";
import BillsPage from "./pages/Bills/BillsPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="invoices/new" element={<NewInvoiceForm />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="vendors/:id" element={<VendorDetailPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
