import { Property } from '@/types/property.types';
import { formatCurrency, formatArea, formatDate, capitalize } from '@/utils/format';

interface Props {
  property: Property;
}

function Feature({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-gray-500 uppercase font-medium">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export default function PropertyDetail({ property }: Props) {
  const photos = property.media?.filter((m) => m.mediaType === 'photo') ?? [];

  return (
    <div className="space-y-8">
      {/* Gallery */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl overflow-hidden">
          <img
            src={photos[0].url}
            alt={property.address}
            className="w-full h-80 object-cover sm:col-span-1"
          />
          {photos.length > 1 && (
            <div className="grid grid-cols-2 gap-2 sm:col-span-1">
              {photos.slice(1, 5).map((m) => (
                <img key={m.id} src={m.url} alt="" className="w-full h-[154px] object-cover" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(property.price, property.currency)}
            </p>
            <p className="text-gray-500 mt-1">
              {property.address}, {property.city} {property.province}
            </p>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-gray-100 py-5">
            <Feature label="Rooms" value={property.roomsCount} />
            {property.bathroomsCount && <Feature label="Bathrooms" value={property.bathroomsCount} />}
            <Feature label="Area" value={formatArea(property.totalAreaSqm)} />
            <Feature label="Type" value={capitalize(property.propertyType)} />
          </dl>

          {property.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full capitalize"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">Property details</h3>
            <dl className="space-y-2.5">
              {property.yearBuilt && <Feature label="Year built" value={property.yearBuilt} />}
              {property.condition && (
                <Feature label="Condition" value={capitalize(property.condition)} />
              )}
              {property.energyClass && <Feature label="Energy class" value={property.energyClass} />}
              {property.heatingType && <Feature label="Heating" value={property.heatingType} />}
              <Feature label="Furnished" value={property.isFurnished ? 'Yes' : 'No'} />
              <Feature label="Elevator" value={property.hasElevator ? 'Yes' : 'No'} />
              <Feature label="Parking" value={property.hasParking ? 'Yes' : 'No'} />
              <Feature label="Garden" value={property.hasGarden ? 'Yes' : 'No'} />
              <Feature label="Terrace" value={property.hasTerrace ? 'Yes' : 'No'} />
            </dl>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-500">
            Listed {formatDate(property.createdAt)} &middot; {property.viewCount} views
          </div>
        </aside>
      </div>
    </div>
  );
}
