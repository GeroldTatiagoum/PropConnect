import api from './api';
import { Property, CreatePropertyDto, PropertyFilters, PropertyStatus } from '@/types/property.types';
import { PaginatedResponse } from '@/types/common.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('PropertyService');

type AdminPaginated<T> = {
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean };
};

export const propertyService = {
  async getProperties(
    filters?: PropertyFilters,
    page = 1,
    limit = 12,
  ): Promise<PaginatedResponse<Property>> {
    logger.debug('getProperties', { filters, page, limit });
    try {
      const { data } = await api.get<PaginatedResponse<Property>>('/properties', {
        params: { ...filters, page, limit },
      });
      logger.debug(`getProperties result: total=${data.total} returned=${data.data?.length ?? 0}`);
      return data;
    } catch (err) {
      logger.error('getProperties failed', err);
      throw err;
    }
  },

  async getPropertyById(id: string): Promise<Property> {
    logger.debug(`getPropertyById: id=${id}`);
    try {
      const { data } = await api.get<Property>(`/properties/${id}`);
      logger.debug(`getPropertyById success: id=${id} status=${data.status}`);
      return data;
    } catch (err) {
      logger.error(`getPropertyById failed: id=${id}`, err);
      throw err;
    }
  },

  async getMyProperties(page = 1, limit = 12): Promise<PaginatedResponse<Property>> {
    logger.debug(`getMyProperties: page=${page} limit=${limit}`);
    try {
      const { data } = await api.get<PaginatedResponse<Property>>('/properties/my', {
        params: { page, limit },
      });
      logger.debug(`getMyProperties result: total=${data.total}`);
      return data;
    } catch (err) {
      logger.error('getMyProperties failed', err);
      throw err;
    }
  },

  async createProperty(dto: CreatePropertyDto): Promise<Property> {
    logger.info(`createProperty: type=${dto.propertyType} price=${dto.price}`);
    try {
      const { data } = await api.post<Property>('/properties', dto);
      logger.info(`createProperty success: id=${data.id}`);
      return data;
    } catch (err) {
      logger.error('createProperty failed', err);
      throw err;
    }
  },

  async updateProperty(id: string, dto: Partial<CreatePropertyDto>): Promise<Property> {
    logger.info(`updateProperty: id=${id} fields=${Object.keys(dto).join(',')}`);
    try {
      const { data } = await api.patch<Property>(`/properties/${id}`, dto);
      logger.info(`updateProperty success: id=${id}`);
      return data;
    } catch (err) {
      logger.error(`updateProperty failed: id=${id}`, err);
      throw err;
    }
  },

  async getAdminProperties(
    params: { status?: PropertyStatus; page?: number; limit?: number } = {},
  ): Promise<AdminPaginated<Property>> {
    logger.debug('getAdminProperties', params);
    try {
      const { data } = await api.get<AdminPaginated<Property>>('/properties/admin', { params });
      logger.debug(`getAdminProperties result: total=${data.pagination.total}`);
      return data;
    } catch (err) {
      logger.error('getAdminProperties failed', err);
      throw err;
    }
  },

  async getPropertyStats(): Promise<Record<string, number>> {
    logger.debug('getPropertyStats');
    try {
      const { data } = await api.get<Record<string, number>>('/properties/stats');
      logger.debug('getPropertyStats result', data);
      return data;
    } catch (err) {
      logger.error('getPropertyStats failed', err);
      throw err;
    }
  },

  async changePropertyStatus(id: string, status: PropertyStatus): Promise<Property> {
    logger.info(`changePropertyStatus: id=${id} newStatus=${status}`);
    try {
      const { data } = await api.patch<Property>(`/properties/${id}/status`, { status });
      logger.info(`changePropertyStatus success: id=${id}`);
      return data;
    } catch (err) {
      logger.error(`changePropertyStatus failed: id=${id}`, err);
      throw err;
    }
  },

  async deleteProperty(id: string): Promise<void> {
    logger.warn(`deleteProperty: id=${id}`);
    try {
      await api.delete(`/properties/${id}`);
      logger.info(`deleteProperty success: id=${id}`);
    } catch (err) {
      logger.error(`deleteProperty failed: id=${id}`, err);
      throw err;
    }
  },

  async uploadMedia(propertyId: string, files: File[]): Promise<Property> {
    logger.info(`uploadMedia: propertyId=${propertyId} fileCount=${files.length}`);
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    try {
      const { data } = await api.post<Property>(`/properties/${propertyId}/media`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      logger.info(`uploadMedia success: propertyId=${propertyId}`);
      return data;
    } catch (err) {
      logger.error(`uploadMedia failed: propertyId=${propertyId}`, err);
      throw err;
    }
  },
};
