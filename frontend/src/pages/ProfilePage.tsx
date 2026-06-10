import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchMe, updateMe, clearUserError, selectUserProfile, selectUserLoading } from '@/store/user.slice';
import { useAuth } from '@/hooks/useAuth';
import { KycStatus, UpdateUserDto } from '@/types/user.types';

const KYC_BADGE: Record<KycStatus, { label: string; className: string }> = {
  [KycStatus.APPROVED]: { label: 'Verified', className: 'bg-green-100 text-green-700' },
  [KycStatus.PENDING]: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
  [KycStatus.REJECTED]: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  [KycStatus.EXPIRED]: { label: 'Expired', className: 'bg-gray-100 text-gray-600' },
};

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const { currentUser } = useAuth();

  const user = profile ?? currentUser;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    dispatch(fetchMe());
    return () => {
      dispatch(clearUserError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? '',
        bio: user.bio ?? '',
      });
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSaveSuccess(false);
    setSaveError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    const result = await dispatch(updateMe(form));
    setSaving(false);
    if (updateMe.fulfilled.match(result)) {
      setSaveSuccess(true);
      setEditing(false);
    } else {
      setSaveError((result.payload as string) ?? 'Failed to save changes');
    }
  }

  function handleCancel() {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? '',
        bio: user.bio ?? '',
      });
    }
    setSaveError(null);
    setSaveSuccess(false);
    setEditing(false);
  }

  if (loading && !user) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500">Unable to load profile.</p>
      </main>
    );
  }

  const kyc = KYC_BADGE[user.kycStatus];
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Avatar + identity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
          {user.profilePhotoUrl ? (
            <img
              src={user.profilePhotoUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-primary-700">{initials}</span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
              {user.role}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kyc.className}`}
            >
              {kyc.label}
            </span>
            <span className="text-xs text-gray-400">Member since {joinDate}</span>
          </div>
        </div>
      </div>

      {/* Editable details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Personal information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {saveSuccess && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">
            Profile updated successfully.
          </p>
        )}
        {saveError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{saveError}</p>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First name">
              {editing ? (
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              ) : (
                <Value>{user.firstName}</Value>
              )}
            </Field>

            <Field label="Last name">
              {editing ? (
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              ) : (
                <Value>{user.lastName}</Value>
              )}
            </Field>
          </div>

          <Field label="Email">
            <Value>{user.email}</Value>
          </Field>

          <Field label="Phone">
            {editing ? (
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                className={inputCls}
              />
            ) : (
              <Value>{user.phone ?? <span className="text-gray-400">Not set</span>}</Value>
            )}
          </Field>

          <Field label="Bio">
            {editing ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell others a bit about yourself…"
                className={`${inputCls} resize-none`}
              />
            ) : (
              <Value>{user.bio ?? <span className="text-gray-400">Not set</span>}</Value>
            )}
          </Field>

          {editing && (
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account meta */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Account</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div>
            <dt className="text-gray-500 mb-0.5">Status</dt>
            <dd>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-0.5">Two-factor authentication</dt>
            <dd className="font-medium text-gray-900">{user.twoFaEnabled ? 'Enabled' : 'Disabled'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-0.5">Last login</dt>
            <dd className="font-medium text-gray-900">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-0.5">KYC status</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kyc.className}`}>
                {kyc.label}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-900 py-2">{children}</p>;
}
