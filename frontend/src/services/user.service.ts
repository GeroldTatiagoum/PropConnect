import api from './api';
import { User, UpdateUserDto } from '@/types/user.types';

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async updateMe(dto: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>('/users/me', dto);
    return data;
  },

  async getUserById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async uploadProfilePhoto(file: File): Promise<{ profilePhotoUrl: string }> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post<{ profilePhotoUrl: string }>('/users/me/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
