import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user.types';

export default function Navigation() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <NavLink
        to="/properties"
        className={({ isActive }) =>
          isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
        }
      >
        Properties
      </NavLink>

      {(role === UserRole.SELLER || role === UserRole.ADMIN) && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
          }
        >
          Dashboard
        </NavLink>
      )}

      {role === UserRole.BROKER && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
          }
        >
          Verifications
        </NavLink>
      )}

      {role === UserRole.BUYER && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
          }
        >
          Saved
        </NavLink>
      )}
    </nav>
  );
}
