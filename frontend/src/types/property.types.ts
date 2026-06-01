export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  COMMERCIAL = 'commercial',
  LAND = 'land',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_VERIFICATION = 'pending_verification',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum PropertyCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_RENOVATION = 'needs_renovation',
}

export interface PropertyMedia {
  id: string;
  url: string;
  mediaType: 'photo' | 'video' | 'floor_plan' | 'virtual_tour';
  order: number;
}

export interface Property {
  id: string;
  sellerId: string;
  address: string;
  postalCode: string | null;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  propertyType: PropertyType;
  subType: string | null;
  roomsCount: number;
  bathroomsCount: number | null;
  totalAreaSqm: number;
  landAreaSqm: number | null;
  price: number;
  currency: string;
  description: string | null;
  amenities: string[] | null;
  status: PropertyStatus;
  publishedAt: string | null;
  viewCount: number;
  yearBuilt: number | null;
  condition: PropertyCondition | null;
  heatingType: string | null;
  coolingType: string | null;
  isFurnished: boolean;
  hasElevator: boolean;
  hasParking: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  energyClass: string | null;
  createdAt: string;
  updatedAt: string;
  media: PropertyMedia[];
}

export interface PropertyFilters {
  city?: string;
  province?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minAreaSqm?: number;
  maxAreaSqm?: number;
  minRooms?: number;
  status?: PropertyStatus;
}

export interface CreatePropertyDto {
  address: string;
  postalCode?: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  propertyType: PropertyType;
  roomsCount: number;
  bathroomsCount?: number;
  totalAreaSqm: number;
  price: number;
  description?: string;
  amenities?: string[];
  yearBuilt?: number;
  condition?: PropertyCondition;
  isFurnished?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasTerrace?: boolean;
  hasGarden?: boolean;
  energyClass?: string;
}
