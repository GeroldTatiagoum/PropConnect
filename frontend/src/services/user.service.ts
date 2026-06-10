import api from './api';
import { User, UpdateUserDto, UserRole, KycStatus } from '@/types/user.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('UserService');

type Paginated<T> = {
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number; hasNext: boolean; hasPrev: boolean };
};

type UserStats = {
  total: number;
  active: number;
  byRole: Record<string, number>;
  byKyc: Record<string, number>;
};

export const userService = {
  async getMe(): Promise<User> {
    logger.debug('getMe');
    try {
      const { data } = await api.get<User>('/users/me');
      logger.debug(`getMe success: userId=${data.id} role=${data.role}`);
      return data;
    } catch (err) {
      logger.error('getMe failed', err);
      throw err;
    }
  },

  async updateMe(dto: UpdateUserDto): Promise<User> {
    logger.info(`updateMe: fields=${Object.keys(dto).join(',')}`);
    try {
      const { data } = await api.patch<User>('/users/me', dto);
      logger.info(`updateMe success: userId=${data.id}`);
      return data;
    } catch (err) {
      logger.error('updateMe failed', err);
      throw err;
    }
  },

  async getUserById(id: string): Promise<User> {
    logger.debug(`getUserById: id=${id}`);
    try {
      const { data } = await api.get<User>(`/users/${id}`);
      logger.debug(`getUserById success: id=${id}`);
      return data;
    } catch (err) {
      logger.error(`getUserById failed: id=${id}`, err);
      throw err;
    }
  },

  async getUsers(params: { role?: UserRole; page?: number; limit?: number } = {}): Promise<Paginated<User>> {
    logger.debug('getUsers', params);
    try {
      const { data } = await api.get<Paginated<User>>('/users', { params });
      logger.debug(`getUsers result: total=${data.pagination.total}`);
      return data;
    } catch (err) {
      logger.error('getUsers failed', err);
      throw err;
    }
  },

  async getUserStats(): Promise<UserStats> {
    logger.debug('getUserStats');
    try {
      const { data } = await api.get<UserStats>('/users/stats');
      logger.debug('getUserStats result', { total: data.total, active: data.active });
      return data;
    } catch (err) {
      logger.error('getUserStats failed', err);
      throw err;
    }
  },

  async adminUpdateUser(
    id: string,
    dto: { role?: UserRole; isActive?: boolean; kycStatus?: KycStatus },
  ): Promise<User> {
    logger.info(`adminUpdateUser: id=${id} fields=${Object.keys(dto).join(',')}`);
    try {
      const { data } = await api.patch<User>(`/users/${id}`, dto);
      logger.info(`adminUpdateUser success: id=${id}`);
      return data;
    } catch (err) {
      logger.error(`adminUpdateUser failed: id=${id}`, err);
      throw err;
    }
  },

  async uploadProfilePhoto(file: File): Promise<{ profilePhotoUrl: string }> {
    logger.info(`uploadProfilePhoto: size=${file.size} mime=${file.type}`);
    const form = new FormData();
    form.append('file', file);
    try {
      const { data } = await api.post<{ profilePhotoUrl: string }>('/users/me/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      logger.info('uploadProfilePhoto success');
      return data;
    } catch (err) {
      logger.error('uploadProfilePhoto failed', err);
      throw err;
    }
  },
};
