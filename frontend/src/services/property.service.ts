import api from './api';
import { Property, CreatePropertyDto, PropertyFilters } from '@/types/property.types';
import { PaginatedResponse } from '@/types/common.types';

export const propertyService = {
  async getProperties(
    filters?: PropertyFilters,
    page = 1,
    limit = 12,
  ): Promise<PaginatedResponse<Property>> {
    const { data } = await api.get<PaginatedResponse<Property>>('/properties', {
      params: { ...filters, page, limit },
    });
    return data;
  },

  async getPropertyById(id: string): Promise<Property> {
    const { data } = await api.get<Property>(`/properties/${id}`);
    return data;
  },

  async getMyProperties(page = 1, limit = 12): Promise<PaginatedResponse<Property>> {
    const { data } = await api.get<PaginatedResponse<Property>>('/properties/my', {
      params: { page, limit },
    });
    return data;
  },

  async createProperty(dto: CreatePropertyDto): Promise<Property> {
    const { data } = await api.post<Property>('/properties', dto);
    return data;
  },

  async updateProperty(id: string, dto: Partial<CreatePropertyDto>): Promise<Property> {
    const { data } = await api.patch<Property>(`/properties/${id}`, dto);
    return data;
  },

  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  },

  async uploadMedia(propertyId: string, files: File[]): Promise<Property> {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    const { data } = await api.post<Property>(`/properties/${propertyId}/media`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
