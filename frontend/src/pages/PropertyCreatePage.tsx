import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createProperty } from '@/store/properties.slice';
import { CreatePropertyDto, PropertyType, PropertyCondition } from '@/types/property.types';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: PropertyType.APARTMENT, label: 'Apartment' },
  { value: PropertyType.HOUSE, label: 'House' },
  { value: PropertyType.VILLA, label: 'Villa' },
  { value: PropertyType.COMMERCIAL, label: 'Commercial' },
  { value: PropertyType.LAND, label: 'Land' },
];

const CONDITIONS: { value: PropertyCondition; label: string }[] = [
  { value: PropertyCondition.NEW, label: 'New' },
  { value: PropertyCondition.GOOD, label: 'Good' },
  { value: PropertyCondition.FAIR, label: 'Fair' },
  { value: PropertyCondition.NEEDS_RENOVATION, label: 'Needs renovation' },
];

const ENERGY_CLASSES = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];

const AMENITY_OPTIONS = [
  'Pool', 'Gym', 'Concierge', 'Storage', 'Cellar', 'Balcony',
  'Sea view', 'Mountain view', 'Smart home', 'Solar panels',
];

type FormState = Omit<CreatePropertyDto, 'amenities'> & { amenities: string[] };

const defaultForm: FormState = {
  address: '',
  postalCode: '',
  city: '',
  province: '',
  latitude: 0,
  longitude: 0,
  propertyType: PropertyType.APARTMENT,
  roomsCount: 1,
  bathroomsCount: undefined,
  totalAreaSqm: 0,
  landAreaSqm: undefined,
  price: 0,
  description: '',
  yearBuilt: undefined,
  condition: undefined,
  isFurnished: false,
  hasElevator: false,
  hasParking: false,
  hasTerrace: false,
  hasGarden: false,
  energyClass: '',
  amenities: [],
};

export default function PropertyCreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setField(name as keyof FormState, value as never);
  }

  function handleNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setField(name as keyof FormState, value === '' ? undefined : Number(value) as never);
  }

  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setField(name as keyof FormState, checked as never);
  }

  function toggleAmenity(amenity: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const dto: CreatePropertyDto = {
      ...form,
      postalCode: form.postalCode || undefined,
      description: form.description || undefined,
      energyClass: form.energyClass || undefined,
      amenities: form.amenities.length > 0 ? form.amenities : undefined,
    };

    const result = await dispatch(createProperty(dto));
    setSubmitting(false);

    if (createProperty.fulfilled.match(result)) {
      navigate('/dashboard');
    } else {
      setError((result.payload as string) ?? 'Failed to create listing');
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New listing</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your listing will be saved as a draft and reviewed before publishing.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Location */}
        <Section title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Label required>Street address</Label>
              <input
                name="address"
                value={form.address}
                onChange={handleText}
                required
                placeholder="Via Roma 123"
                className={inputCls}
              />
            </div>
            <div>
              <Label required>City</Label>
              <input
                name="city"
                value={form.city}
                onChange={handleText}
                required
                placeholder="Milano"
                className={inputCls}
              />
            </div>
            <div>
              <Label required>Province</Label>
              <input
                name="province"
                value={form.province}
                onChange={handleText}
                required
                placeholder="MI"
                className={inputCls}
              />
            </div>
            <div>
              <Label>Postal code</Label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleText}
                placeholder="20121"
                maxLength={10}
                className={inputCls}
              />
            </div>
            <div />
            <div>
              <Label required>Latitude</Label>
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude || ''}
                onChange={handleNumber}
                required
                placeholder="45.4642"
                className={inputCls}
              />
            </div>
            <div>
              <Label required>Longitude</Label>
              <input
                name="longitude"
                type="number"
                step="any"
                value={form.longitude || ''}
                onChange={handleNumber}
                required
                placeholder="9.1900"
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* Property details */}
        <Section title="Property details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label required>Type</Label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleText}
                required
                className={inputCls}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Condition</Label>
              <select
                name="condition"
                value={form.condition ?? ''}
                onChange={(e) => setField('condition', (e.target.value as PropertyCondition) || undefined)}
                className={inputCls}
              >
                <option value="">— Select —</option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label required>Rooms</Label>
              <input
                name="roomsCount"
                type="number"
                min={0}
                max={100}
                value={form.roomsCount}
                onChange={handleNumber}
                required
                className={inputCls}
              />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <input
                name="bathroomsCount"
                type="number"
                min={0}
                value={form.bathroomsCount ?? ''}
                onChange={handleNumber}
                className={inputCls}
              />
            </div>
            <div>
              <Label required>Total area (m²)</Label>
              <input
                name="totalAreaSqm"
                type="number"
                min={1}
                step="any"
                value={form.totalAreaSqm || ''}
                onChange={handleNumber}
                required
                className={inputCls}
              />
            </div>
            <div>
              <Label>Land area (m²)</Label>
              <input
                name="landAreaSqm"
                type="number"
                min={0}
                step="any"
                value={form.landAreaSqm ?? ''}
                onChange={handleNumber}
                className={inputCls}
              />
            </div>
            <div>
              <Label>Year built</Label>
              <input
                name="yearBuilt"
                type="number"
                min={1800}
                max={new Date().getFullYear()}
                value={form.yearBuilt ?? ''}
                onChange={handleNumber}
                placeholder="2005"
                className={inputCls}
              />
            </div>
            <div>
              <Label>Energy class</Label>
              <select
                name="energyClass"
                value={form.energyClass ?? ''}
                onChange={handleText}
                className={inputCls}
              >
                <option value="">— Select —</option>
                {ENERGY_CLASSES.map((c) => (
                  <option key={c} value={c[0]}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Features */}
        <Section title="Features">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(
              [
                ['isFurnished', 'Furnished'],
                ['hasElevator', 'Elevator'],
                ['hasParking', 'Parking'],
                ['hasTerrace', 'Terrace'],
                ['hasGarden', 'Garden'],
              ] as [keyof FormState, string][]
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={!!form[key]}
                  onChange={handleCheck}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-5">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {AMENITY_OPTIONS.map((a) => {
                const selected = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selected
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Price & description */}
        <Section title="Price & description">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Label required>Asking price (€)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm pointer-events-none">
                  €
                </span>
                <input
                  name="price"
                  type="number"
                  min={0}
                  step="any"
                  value={form.price || ''}
                  onChange={handleNumber}
                  required
                  placeholder="450 000"
                  className={`${inputCls} pl-7`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleText}
                rows={5}
                placeholder="Describe the property, its highlights and surroundings…"
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save listing'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
