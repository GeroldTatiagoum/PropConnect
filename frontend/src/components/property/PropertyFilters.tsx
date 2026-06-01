import { FormEvent, useState } from 'react';
import { PropertyFilters as Filters, PropertyType } from '@/types/property.types';

interface Props {
  initial: Filters;
  onApply: (filters: Filters) => void;
}

export default function PropertyFilters({ initial, onApply }: Props) {
  const [filters, setFilters] = useState<Filters>(initial);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onApply(filters);
  }

  function handleReset() {
    setFilters({});
    onApply({});
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">City</label>
        <input
          type="text"
          value={filters.city ?? ''}
          onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
          placeholder="e.g. Milano"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Type</label>
        <select
          value={filters.propertyType ?? ''}
          onChange={(e) =>
            setFilters({ ...filters, propertyType: (e.target.value as PropertyType) || undefined })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All types</option>
          {Object.values(PropertyType).map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
          Price range (EUR)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Min rooms</label>
        <input
          type="number"
          min={1}
          value={filters.minRooms ?? ''}
          onChange={(e) =>
            setFilters({ ...filters, minRooms: e.target.value ? Number(e.target.value) : undefined })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
