import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user.types';
import { isValidPassword, getPasswordStrength } from '@/utils/validation';

export default function RegisterForm() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.BUYER as UserRole.BUYER | UserRole.SELLER,
    phone: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const strength = getPasswordStrength(form.password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    if (!isValidPassword(form.password)) {
      setPasswordError(
        'Password must be at least 12 characters and include uppercase, lowercase, number and symbol.',
      );
      return;
    }
    setPasswordError('');
    const dto = { ...form, phone: form.phone || undefined };
    const result = await register(dto);
    if (!('error' in result)) {
      navigate('/dashboard', { replace: true });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {form.password && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {(['weak', 'medium', 'strong'] as const).map((level, i) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full ${
                    ['weak', 'medium', 'strong'].indexOf(strength) >= i
                      ? strength === 'weak'
                        ? 'bg-red-400'
                        : strength === 'medium'
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 capitalize">{strength}</span>
          </div>
        )}
        {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
        <div className="grid grid-cols-2 gap-3">
          {([UserRole.BUYER, UserRole.SELLER] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                form.role === r
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+39 3XX XXX XXXX"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
