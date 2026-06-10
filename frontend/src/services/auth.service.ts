import api from './api';
import { AuthResponse, LoginDto, RefreshTokenDto, RegisterDto } from '@/types/auth.types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('AuthService');

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    logger.info(`register: email=${dto.email} role=${dto.role ?? 'buyer'}`);
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', dto);
      logger.info(`register success: userId=${data.id}`);
      return data;
    } catch (err) {
      logger.error(`register failed: email=${dto.email}`, err);
      throw err;
    }
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    logger.info(`login: email=${dto.email}`);
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', dto);
      logger.info(`login success: userId=${data.id} role=${data.role}`);
      return data;
    } catch (err) {
      logger.warn(`login failed: email=${dto.email}`, err);
      throw err;
    }
  },

  async refresh(dto: RefreshTokenDto): Promise<AuthResponse> {
    logger.debug('token refresh requested');
    try {
      const { data } = await api.post<AuthResponse>('/auth/refresh', dto);
      logger.debug('token refresh success');
      return data;
    } catch (err) {
      logger.warn('token refresh failed', err);
      throw err;
    }
  },

  async logout(): Promise<void> {
    logger.info('logout');
    try {
      await api.post('/auth/logout');
      logger.info('logout success');
    } catch (err) {
      logger.warn('logout request failed (continuing anyway)', err);
    }
  },
};
