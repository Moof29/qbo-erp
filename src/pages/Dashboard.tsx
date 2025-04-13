
import React from 'react';
import { CreditCard, FileText, Building2, DollarSign } from 'lucide-react';
import StatCard from '@/components/ui/data-display/StatCard';
import PageHeader from '@/components/ui/elements/PageHeader';
import RecentInvoicesTable from '@/components/Dashboard/RecentInvoicesTable';
import RecentPaymentsTable from '@/components/Dashboard/RecentPaymentsTable';
import FloatingActionButton from '@/components/ui/actions/FloatingActionButton';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your business"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Open Invoices" 
          value="12" 
          icon={<FileText size={20} />} 
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard 
          title="Outstanding Payments" 
          value={formatCurrency(24152.50)} 
          icon={<CreditCard size={20} />} 
          valueClassName="text-amber-500"
        />
        <StatCard 
          title="Vendors" 
          value="28" 
          icon={<Building2 size={20} />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Total Revenue (Last 30 Days)" 
          value={formatCurrency(84523.15)} 
          icon={<DollarSign size={20} />} 
          valueClassName="text-green-500"
          trend={{ value: 8, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInvoicesTable />
        <RecentPaymentsTable />
      </div>
      
      <div className="fixed bottom-6 right-6 space-x-3">
        <Button 
          className="shadow-lg" 
          onClick={() => navigate('/invoices/new')}
        >
          <FileText className="mr-2 h-4 w-4" /> New Invoice
        </Button>
        <Button 
          variant="secondary" 
          className="shadow-lg" 
          onClick={() => navigate('/payments/new')}
        >
          <CreditCard className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
