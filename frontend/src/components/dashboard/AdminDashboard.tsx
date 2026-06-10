import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/services/user.service';
import { propertyService } from '@/services/property.service';
import { User, UserRole, KycStatus } from '@/types/user.types';
import { Property, PropertyStatus } from '@/types/property.types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'users' | 'properties';

type UserStats = {
  total: number;
  active: number;
  byRole: Record<string, number>;
  byKyc: Record<string, number>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_BADGE: Record<UserRole, string> = {
  [UserRole.SELLER]: 'bg-blue-100 text-blue-700',
  [UserRole.BUYER]: 'bg-purple-100 text-purple-700',
  [UserRole.BROKER]: 'bg-indigo-100 text-indigo-700',
  [UserRole.ADMIN]: 'bg-red-100 text-red-700',
};

const KYC_BADGE: Record<KycStatus, { label: string; cls: string }> = {
  [KycStatus.APPROVED]: { label: 'Verified', cls: 'bg-green-100 text-green-700' },
  [KycStatus.PENDING]: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
  [KycStatus.REJECTED]: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  [KycStatus.EXPIRED]: { label: 'Expired', cls: 'bg-gray-100 text-gray-500' },
};

const STATUS_BADGE: Record<PropertyStatus, { label: string; cls: string }> = {
  [PropertyStatus.PUBLISHED]: { label: 'Published', cls: 'bg-green-100 text-green-700' },
  [PropertyStatus.DRAFT]: { label: 'Draft', cls: 'bg-gray-100 text-gray-600' },
  [PropertyStatus.PENDING_VERIFICATION]: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
  [PropertyStatus.ARCHIVED]: { label: 'Archived', cls: 'bg-red-100 text-red-600' },
};

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

function fmtPrice(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initials(u: User): string {
  return `${u.firstName[0] ?? ''}${u.lastName[0] ?? ''}`.toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? fmt(value) : value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Pagination({
  page,
  pages,
  onPrev,
  onNext,
}: {
  page: number;
  pages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span className="text-gray-500">
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={page >= pages}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');

  // Overview stats
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [propStats, setPropStats] = useState<Record<string, number> | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Users tab
  const [users, setUsers] = useState<User[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPages, setUsersPages] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [usersRoleFilter, setUsersRoleFilter] = useState<UserRole | ''>('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [userActionId, setUserActionId] = useState<string | null>(null);

  // Properties tab
  const [properties, setProperties] = useState<Property[]>([]);
  const [propsTotal, setPropsTotal] = useState(0);
  const [propsPages, setPropsPages] = useState(1);
  const [propsPage, setPropsPage] = useState(1);
  const [propsStatusFilter, setPropsStatusFilter] = useState<PropertyStatus | ''>('');
  const [propsLoading, setPropsLoading] = useState(false);
  const [propActionId, setPropActionId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Load overview stats on mount
  useEffect(() => {
    setStatsLoading(true);
    Promise.all([userService.getUserStats(), propertyService.getPropertyStats()])
      .then(([us, ps]) => {
        setUserStats(us);
        setPropStats(ps);
      })
      .catch(() => setError('Failed to load statistics'))
      .finally(() => setStatsLoading(false));
  }, []);

  // Load users when tab is active or filters change
  const loadUsers = useCallback(async (page: number, role: UserRole | '') => {
    setUsersLoading(true);
    try {
      const res = await userService.getUsers({ role: role || undefined, page, limit: 15 });
      setUsers(res.data);
      setUsersTotal(res.pagination.total);
      setUsersPages(res.pagination.pages);
    } catch {
      setError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'users') loadUsers(usersPage, usersRoleFilter);
  }, [tab, usersPage, usersRoleFilter, loadUsers]);

  // Load properties when tab is active or filters change
  const loadProperties = useCallback(async (page: number, status: PropertyStatus | '') => {
    setPropsLoading(true);
    try {
      const res = await propertyService.getAdminProperties({ status: status || undefined, page, limit: 15 });
      setProperties(res.data);
      setPropsTotal(res.pagination.total);
      setPropsPages(res.pagination.pages);
    } catch {
      setError('Failed to load properties');
    } finally {
      setPropsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'properties') loadProperties(propsPage, propsStatusFilter);
  }, [tab, propsPage, propsStatusFilter, loadProperties]);

  async function toggleUserActive(user: User) {
    setUserActionId(user.id);
    try {
      const updated = await userService.adminUpdateUser(user.id, { isActive: !user.isActive });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      if (userStats) {
        setUserStats({ ...userStats, active: userStats.active + (updated.isActive ? 1 : -1) });
      }
    } catch {
      setError('Failed to update user');
    } finally {
      setUserActionId(null);
    }
  }

  async function handleChangePropertyStatus(property: Property, status: PropertyStatus) {
    setPropActionId(property.id);
    try {
      const updated = await propertyService.changePropertyStatus(property.id, status);
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      // Refresh stats
      propertyService.getPropertyStats().then(setPropStats).catch(() => null);
    } catch {
      setError('Failed to update property status');
    } finally {
      setPropActionId(null);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: `Users${usersTotal ? ` (${fmt(usersTotal)})` : ''}` },
    { key: 'properties', label: `Properties${propsTotal ? ` (${fmt(propsTotal)})` : ''}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Admin dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage users, listings, and platform settings.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4 font-bold">×</button>
        </div>
      )}

      {/* Tab bar */}
      <div className="border-b border-gray-200 flex gap-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {statsLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total users" value={userStats?.total ?? 0} sub={`${userStats?.active ?? 0} active`} />
                <StatCard label="Published" value={propStats?.[PropertyStatus.PUBLISHED] ?? 0} sub="listings live" />
                <StatCard label="Pending review" value={propStats?.[PropertyStatus.PENDING_VERIFICATION] ?? 0} sub="awaiting approval" />
                <StatCard label="Draft" value={propStats?.[PropertyStatus.DRAFT] ?? 0} sub="not submitted" />
              </div>

              {userStats && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Users by role</h3>
                    <dl className="space-y-2">
                      {Object.values(UserRole).map((role) => (
                        <div key={role} className="flex items-center justify-between">
                          <Badge label={role} cls={ROLE_BADGE[role]} />
                          <span className="text-sm font-medium text-gray-900">{fmt(userStats.byRole[role] ?? 0)}</span>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Properties by status</h3>
                    <dl className="space-y-2">
                      {Object.values(PropertyStatus).map((s) => {
                        const b = STATUS_BADGE[s];
                        return (
                          <div key={s} className="flex items-center justify-between">
                            <Badge label={b.label} cls={b.cls} />
                            <span className="text-sm font-medium text-gray-900">{fmt(propStats?.[s] ?? 0)}</span>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Users ── */}
      {tab === 'users' && (
        <div className="space-y-4">
          {/* Role filter */}
          <div className="flex flex-wrap gap-2">
            {([['', 'All'], ...Object.values(UserRole).map((r) => [r, r])] as [string, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setUsersRoleFilter(val as UserRole | ''); setUsersPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  usersRoleFilter === val
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </button>
            ))}
          </div>

          {usersLoading ? (
            <Spinner />
          ) : users.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">No users found.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">KYC</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Joined</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const kyc = KYC_BADGE[user.kycStatus];
                      const busy = userActionId === user.id;
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {user.profilePhotoUrl ? (
                                  <img src={user.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-semibold text-primary-700">{initials(user)}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge label={user.role} cls={ROLE_BADGE[user.role]} />
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <Badge label={kyc.label} cls={kyc.cls} />
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{fmtDate(user.createdAt)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => toggleUserActive(user)}
                              disabled={busy}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                                user.isActive
                                  ? 'text-red-600 border-red-200 hover:bg-red-50'
                                  : 'text-green-600 border-green-200 hover:bg-green-50'
                              }`}
                            >
                              {busy ? '…' : user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={usersPage}
                pages={usersPages}
                onPrev={() => setUsersPage((p) => p - 1)}
                onNext={() => setUsersPage((p) => p + 1)}
              />
            </>
          )}
        </div>
      )}

      {/* ── Properties ── */}
      {tab === 'properties' && (
        <div className="space-y-4">
          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {([['', 'All'], ...Object.values(PropertyStatus).map((s) => [s, STATUS_BADGE[s].label])] as [string, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setPropsStatusFilter(val as PropertyStatus | ''); setPropsPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  propsStatusFilter === val
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {propsLoading ? (
            <Spinner />
          ) : properties.length === 0 ? (
            <p className="text-center py-12 text-gray-400 text-sm">No properties found.</p>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Property</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Seller</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.map((prop) => {
                      const badge = STATUS_BADGE[prop.status];
                      const busy = propActionId === prop.id;
                      const thumb = prop.media?.[0];
                      return (
                        <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-9 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                                {thumb ? (
                                  <img src={thumb.url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{prop.address}</p>
                                <p className="text-xs text-gray-400">{prop.city} · {prop.propertyType}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900 font-medium hidden sm:table-cell">{fmtPrice(prop.price)}</td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                            {(prop as Property & { seller?: User }).seller
                              ? `${(prop as Property & { seller?: User }).seller!.firstName} ${(prop as Property & { seller?: User }).seller!.lastName}`
                              : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge label={badge.label} cls={badge.cls} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {prop.status !== PropertyStatus.PUBLISHED && prop.status !== PropertyStatus.ARCHIVED && (
                                <button
                                  onClick={() => handleChangePropertyStatus(prop, PropertyStatus.PUBLISHED)}
                                  disabled={busy}
                                  className="text-xs font-medium px-3 py-1.5 rounded-lg border text-green-600 border-green-200 hover:bg-green-50 transition-colors disabled:opacity-50"
                                >
                                  {busy ? '…' : 'Publish'}
                                </button>
                              )}
                              {prop.status !== PropertyStatus.ARCHIVED && (
                                <button
                                  onClick={() => handleChangePropertyStatus(prop, PropertyStatus.ARCHIVED)}
                                  disabled={busy}
                                  className="text-xs font-medium px-3 py-1.5 rounded-lg border text-gray-500 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  {busy ? '…' : 'Archive'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={propsPage}
                pages={propsPages}
                onPrev={() => setPropsPage((p) => p - 1)}
                onNext={() => setPropsPage((p) => p + 1)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
