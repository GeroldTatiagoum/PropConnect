import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user.types';
import SellerDashboard from '@/components/dashboard/SellerDashboard';
import BuyerDashboard from '@/components/dashboard/BuyerDashboard';
import BrokerDashboard from '@/components/dashboard/BrokerDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {role === UserRole.SELLER && <SellerDashboard />}
      {role === UserRole.BUYER && <BuyerDashboard />}
      {role === UserRole.BROKER && <BrokerDashboard />}
      {role === UserRole.ADMIN && <AdminDashboard />}
    </main>
  );
}
