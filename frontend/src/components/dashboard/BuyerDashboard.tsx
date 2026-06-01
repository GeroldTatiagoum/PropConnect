import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { KycStatus } from '@/types/user.types';

const kycStatusInfo: Record<KycStatus, { label: string; description: string; color: string }> = {
  [KycStatus.PENDING]: {
    label: 'KYC Pending',
    description: 'Your identity has not been verified yet.',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
  [KycStatus.APPROVED]: {
    label: 'KYC Approved',
    description: 'Your identity is verified. You can contact sellers.',
    color: 'bg-green-50 border-green-200 text-green-800',
  },
  [KycStatus.REJECTED]: {
    label: 'KYC Rejected',
    description: 'Your verification was rejected. Please resubmit your documents.',
    color: 'bg-red-50 border-red-200 text-red-800',
  },
  [KycStatus.EXPIRED]: {
    label: 'KYC Expired',
    description: 'Your verification has expired and needs renewal.',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
  },
};

export default function BuyerDashboard() {
  const { currentUser } = useAuth();
  const kycStatus = (currentUser as { kycStatus?: KycStatus } | null)?.kycStatus ?? KycStatus.PENDING;
  const info = kycStatusInfo[kycStatus];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Welcome, {currentUser?.firstName}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Buyer dashboard</p>
      </div>

      <div className={`border rounded-xl px-5 py-4 ${info.color}`}>
        <p className="font-semibold text-sm">{info.label}</p>
        <p className="text-sm mt-0.5">{info.description}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/properties"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Browse properties</h3>
          <p className="text-sm text-gray-500">Search and filter available listings.</p>
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Messages</h3>
          <p className="text-sm text-gray-500">
            {kycStatus === KycStatus.APPROVED
              ? 'No unread messages.'
              : 'Complete KYC to unlock messaging.'}
          </p>
        </div>
      </div>
    </div>
  );
}
