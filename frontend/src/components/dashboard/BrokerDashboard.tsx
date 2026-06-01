import { useAuth } from '@/hooks/useAuth';

export default function BrokerDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Welcome, {currentUser?.firstName}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Broker dashboard</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending verifications', value: '—', color: 'text-yellow-600' },
          { label: 'In review', value: '—', color: 'text-blue-600' },
          { label: 'Completed today', value: '—', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-gray-900">Verification queue</h3>
        </div>
        <div className="px-5 py-10 text-center text-gray-400 text-sm">
          No pending verifications.
        </div>
      </div>
    </div>
  );
}
