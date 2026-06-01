import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '@/hooks/useProperty';
import PropertyDetail from '@/components/property/PropertyDetail';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentProperty, loading, fetchPropertyById, clearCurrentProperty } = useProperty();

  useEffect(() => {
    if (id) fetchPropertyById(id);
    return () => { clearCurrentProperty(); };
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-80 bg-gray-100 rounded-xl animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!currentProperty) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Property not found</h1>
        <Link to="/properties" className="text-primary-600 hover:underline text-sm">
          Back to listings
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/properties"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        &larr; Back to listings
      </Link>
      <PropertyDetail property={currentProperty} />
    </main>
  );
}
