import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '@/hooks/useProperty';
import PropertyCard from '@/components/property/PropertyCard';

export default function SellerDashboard() {
  const { myProperties, fetchMyProperties, loading } = useProperty();

  useEffect(() => {
    fetchMyProperties();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My listings</h2>
          <p className="text-sm text-gray-500 mt-0.5">{myProperties.length} properties</p>
        </div>
        <Link
          to="/properties/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          + New listing
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : myProperties.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-3">No listings yet.</p>
          <Link
            to="/properties/new"
            className="text-primary-600 font-medium hover:underline text-sm"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
