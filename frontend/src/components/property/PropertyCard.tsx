import { Link } from 'react-router-dom';
import { Property, PropertyStatus } from '@/types/property.types';
import { formatCurrency, formatArea } from '@/utils/format';

interface Props {
  property: Property;
}

const statusBadge: Record<PropertyStatus, { label: string; className: string }> = {
  [PropertyStatus.PUBLISHED]: { label: 'Published', className: 'bg-green-100 text-green-700' },
  [PropertyStatus.DRAFT]: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
  [PropertyStatus.PENDING_VERIFICATION]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
  },
  [PropertyStatus.ARCHIVED]: { label: 'Archived', className: 'bg-red-100 text-red-600' },
};

export default function PropertyCard({ property }: Props) {
  const cover = property.media?.find((m) => m.mediaType === 'photo')?.url;
  const badge = statusBadge[property.status];

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {cover ? (
          <img
            src={cover}
            alt={property.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No photo
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-gray-900">
          {formatCurrency(property.price, property.currency)}
        </p>
        <p className="text-sm text-gray-500 mt-0.5 truncate">
          {property.address}, {property.city}
        </p>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <span>{property.roomsCount} rooms</span>
          {property.bathroomsCount && <span>{property.bathroomsCount} baths</span>}
          <span>{formatArea(property.totalAreaSqm)}</span>
        </div>

        <p className="text-xs text-gray-400 mt-2 capitalize">
          {property.propertyType} &middot; {property.city}, {property.province}
        </p>
      </div>
    </Link>
  );
}
