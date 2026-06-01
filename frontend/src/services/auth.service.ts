import api from './api';
import { AuthResponse, LoginDto, RefreshTokenDto, RegisterDto } from '@/types/auth.types';

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  async refresh(dto: RefreshTokenDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/refresh', dto);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
