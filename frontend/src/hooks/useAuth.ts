import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  login,
  register,
  logout,
  clearError,
  selectAuth,
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from '@/store/auth.slice';
import { LoginDto, RegisterDto } from '@/types/auth.types';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuth);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector((state: RootState) => selectUserRole(state));

  return {
    ...auth,
    currentUser,
    isAuthenticated,
    role,
    login: (dto: LoginDto) => dispatch(login(dto)),
    register: (dto: RegisterDto) => dispatch(register(dto)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
}
