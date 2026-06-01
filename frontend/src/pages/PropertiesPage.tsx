import { useEffect } from 'react';
import { useProperty } from '@/hooks/useProperty';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { PropertyFilters as Filters, PropertyStatus } from '@/types/property.types';

export default function PropertiesPage() {
  const { properties, filters, pagination, loading, fetchProperties, setFilters } = useProperty();

  useEffect(() => {
    fetchProperties({ filters: { ...filters, status: PropertyStatus.PUBLISHED } });
  }, []);

  function handleApplyFilters(f: Filters) {
    setFilters(f);
    fetchProperties({ filters: { ...f, status: PropertyStatus.PUBLISHED }, page: 1 });
  }

  function handlePageChange(page: number) {
    fetchProperties({ filters: { ...filters, status: PropertyStatus.PUBLISHED }, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pagination.total} listing{pagination.total !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <PropertyFilters initial={filters} onApply={handleApplyFilters} />
        </aside>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No properties match your filters.
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        page === pagination.page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
