import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Trash2,
  Lock,
  Unlock,
  Eye,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Property, User, Booking, Transaction } from '../types/index.ts';
import { api, showToast } from '../services/api.ts';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { RejectionModal } from '../components/RejectionModal.tsx';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'bookings' | 'transactions'>('moderation');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingProperties: 0,
    totalBookings: 0,
    totalTransactions: 0,
    platformRevenue: 0,
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Property Rejection Modal State
  const [rejectingProperty, setRejectingProperty] = useState<Property | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // 1. Stats
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      // 2. All Properties for moderation
      const propRes = await api.get('/admin/properties');
      if (propRes.data.success) {
        setProperties(propRes.data.properties);
      }

      // 3. All Users
      const userRes = await api.get('/admin/users');
      if (userRes.data.success) {
        setUsers(userRes.data.users);
      }

      // 4. Bookings
      const bookRes = await api.get('/admin/bookings');
      if (bookRes.data.success) {
        setBookings(bookRes.data.bookings);
      }

      // 5. Transactions
      const txRes = await api.get('/admin/transactions');
      if (txRes.data.success) {
        setTransactions(txRes.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveProperty = async (propertyId: string) => {
    try {
      const res = await api.put(`/properties/${propertyId}/moderate`, { action: 'approve' });
      if (res.data.success) {
        showToast('Property verified and published to marketplace!', 'success');
        setProperties(properties.map((p) => (p._id === propertyId ? res.data.property : p)));
        setStats((prev) => ({ ...prev, pendingProperties: Math.max(0, prev.pendingProperties - 1) }));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to approve property', 'error');
    }
  };

  const handleRejectionSuccess = (updatedProperty: Property) => {
    setProperties(properties.map((p) => (p._id === updatedProperty._id ? updatedProperty : p)));
    setStats((prev) => ({ ...prev, pendingProperties: Math.max(0, prev.pendingProperties - 1) }));
  };

  const handleToggleUserBlock = async (userId: string) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        showToast(`User status updated to ${res.data.user.status}`, 'success');
        setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        showToast(`User role updated to ${newRole}`, 'success');
        setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Administrative Control Center..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Superadmin Oversight</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">HavenStay Administration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Platform health, safety compliance, financial volume, and RBAC governance.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Gross Volume</div>
          <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-1">
            ${stats.platformRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Sanctuaries</div>
          <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-1">{stats.totalProperties}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Pending Review</div>
          <p className="text-xl font-black text-amber-600 font-['Outfit'] mt-1">{stats.pendingProperties}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Users</div>
          <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-1">{stats.totalUsers}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Bookings</div>
          <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-1">{stats.totalBookings}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Stripe Escrows</div>
          <p className="text-xl font-black text-indigo-600 font-['Outfit'] mt-1">{stats.totalTransactions}</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative shrink-0 ${
            activeTab === 'moderation'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Listing Approvals ({properties.filter((p) => p.status === 'pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative shrink-0 ${
            activeTab === 'users'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative shrink-0 ${
            activeTab === 'bookings'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>All Reservations ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative shrink-0 ${
            activeTab === 'transactions'
              ? 'text-purple-700 border-b-2 border-purple-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Stripe Escrow Ledger</span>
        </button>
      </div>

      {/* Tab 1: Moderation */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">Property Moderation Feed</h3>
            <span className="text-xs text-slate-400 font-medium">{properties.length} Total Listings in System</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Property</th>
                  <th className="p-4">Owner / Host</th>
                  <th className="p-4">Price / Night</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right pr-6">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50/70">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{prop.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {prop.location.city}, {prop.location.state} • {prop.category}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">{prop.owner.name}</p>
                      <p className="text-[11px] text-slate-400">{prop.owner.email}</p>
                    </td>

                    <td className="p-4 font-bold text-slate-900 font-['Outfit'] text-sm">
                      ${prop.pricePerNight}
                    </td>

                    <td className="p-4">
                      {prop.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {prop.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" /> Needs Review
                        </span>
                      )}
                      {prop.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {prop.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveProperty(prop._id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {prop.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              setRejectingProperty(prop);
                              setIsRejectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">Registered Members Directory</h3>
            <p className="text-xs text-slate-500">Manage account privileges, role assignments, and security status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Member</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Role Assignment</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="p-4 text-slate-700">{u.phone || '—'}</td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRole(u._id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="tenant">Tenant</option>
                        <option value="owner">Owner / Host</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleToggleUserBlock(u._id)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                          u.status === 'active'
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={u.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        {u.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">Global Reservations Log</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">ID & Guest</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Reservation Status</th>
                  <th className="p-4 pr-6">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-slate-900">{b.tenantName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">#{b._id.slice(-6)}</p>
                    </td>
                    <td className="p-4 truncate max-w-xs font-semibold text-slate-800">{b.propertyTitle}</td>
                    <td className="p-4">
                      {b.checkIn} → {b.checkOut} ({b.totalNights}n)
                    </td>
                    <td className="p-4 font-bold text-slate-900 font-['Outfit']">
                      ${b.pricing.totalAmount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <span
                        className={`font-semibold ${
                          b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {b.paymentStatus === 'paid' ? 'Stripe Settled' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Financial Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">Stripe Settlement Ledger</h3>
            <p className="text-xs text-slate-500">Real-time payment intents, escrow splits, and host disbursements</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 pl-6">Transaction Ref</th>
                  <th className="p-4">Gross Amount</th>
                  <th className="p-4">Platform Fee (10%)</th>
                  <th className="p-4">Host Payout (90%)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/70 font-mono text-xs">
                    <td className="p-4 pl-6">
                      <p className="text-slate-900 font-bold">{tx.transactionId}</p>
                      <p className="text-[10px] text-slate-400 font-sans">{tx.paymentMethod}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-900">${tx.amount}</td>
                    <td className="p-4 text-emerald-600 font-bold">${tx.platformFee}</td>
                    <td className="p-4 text-slate-700 font-bold">${tx.hostPayout}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-slate-400 font-sans">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      <RejectionModal
        property={rejectingProperty}
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSuccess={handleRejectionSuccess}
      />
    </div>
  );
};
