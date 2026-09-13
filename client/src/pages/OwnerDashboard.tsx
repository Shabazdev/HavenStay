import React, { useState, useEffect } from 'react';
import {
  Building2,
  DollarSign,
  CalendarCheck,
  Star,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Property, Booking, PropertyCategory } from '../types/index.ts';
import { api, showToast, showConfirmDialog } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [monthlyEarnings, setMonthlyEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Property Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingProperty, setIsSubmittingProperty] = useState(false);
  const [newProp, setNewProp] = useState({
    title: '',
    description: '',
    category: 'Villa' as PropertyCategory,
    pricePerNight: 450,
    city: 'Malibu',
    state: 'California',
    address: '1200 Pacific Coast Highway',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    squareFeet: 3200,
    images: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    amenities: 'Infinity Pool, High-Speed WiFi, Ocean View, Chef Kitchen, Hot Tub',
  });

  // Rejection Feedback View Modal
  const [viewFeedbackProp, setViewFeedbackProp] = useState<Property | null>(null);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      // 1. Get Analytics & Earnings
      const analyticsRes = await api.get('/owner/analytics');
      if (analyticsRes.data.success) {
        // Backend returns { stats, monthlyChartData } — map onto the dashboard state.
        const statsPayload = analyticsRes.data.analytics || analyticsRes.data.stats || {};
        const monthlyPayload = analyticsRes.data.monthlyEarnings || analyticsRes.data.monthlyChartData || [];
        setStats({
          totalProperties: statsPayload.totalProperties || 0,
          totalBookings: statsPayload.totalBookings || 0,
          totalRevenue: statsPayload.totalEarnings ?? statsPayload.totalRevenue ?? 0,
          pendingBookings: statsPayload.pendingBookings || 0,
        });
        setMonthlyEarnings(monthlyPayload);
      }

      // 2. Get My Properties
      const propRes = await api.get('/properties/owner/listings');
      if (propRes.data.success) {
        setProperties(propRes.data.properties);
      }

      // 3. Get Booking Requests
      const bookRes = await api.get('/bookings/owner/requests');
      if (bookRes.data.success) {
        setBookings(bookRes.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProperty(true);
    try {
      const payload = {
        title: newProp.title,
        description: newProp.description,
        category: newProp.category,
        pricePerNight: Number(newProp.pricePerNight),
        location: {
          city: newProp.city,
          state: newProp.state,
          address: newProp.address,
          country: 'United States',
        },
        bedrooms: Number(newProp.bedrooms),
        bathrooms: Number(newProp.bathrooms),
        maxGuests: Number(newProp.maxGuests),
        squareFeet: Number(newProp.squareFeet),
        images: newProp.images.split(',').map((s) => s.trim()),
        amenities: newProp.amenities.split(',').map((s) => s.trim()),
      };

      const res = await api.post('/properties', payload);
      if (res.data.success) {
        showToast('Property submitted for admin review!', 'success');
        setProperties([res.data.property, ...properties]);
        setIsAddModalOpen(false);
        setNewProp({
          title: '',
          description: '',
          category: 'Villa',
          pricePerNight: 450,
          city: 'Malibu',
          state: 'California',
          address: '1200 Pacific Coast Highway',
          bedrooms: 3,
          bathrooms: 3,
          maxGuests: 6,
          squareFeet: 3200,
          images: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
          amenities: 'Infinity Pool, High-Speed WiFi, Ocean View, Chef Kitchen, Hot Tub',
        });
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to list property', 'error');
    } finally {
      setIsSubmittingProperty(false);
    }
  };

  const handleDeleteProperty = async (propId: string) => {
    const confirmed = await showConfirmDialog(
      'Remove this listing?',
      'This property will be permanently removed from the marketplace.',
      'Yes, remove it',
      true
    );
    if (!confirmed.isConfirmed) return;
    try {
      const res = await api.delete(`/properties/${propId}`);
      if (res.data.success) {
        showToast('Property listing removed.', 'success');
        setProperties(properties.filter((p) => p._id !== propId));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to remove listing.', 'error');
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'decline') => {
    try {
      const status = action === 'accept' ? 'confirmed' : 'cancelled';
      const res = await api.put(`/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        showToast(`Booking ${action === 'accept' ? 'accepted' : 'declined'}.`, 'success');
        setBookings(bookings.map((b) => (b._id === bookingId ? res.data.booking : b)));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Host Command Center..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Host Sanctuary Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Host Overview & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back, {user?.name}. Monitor listings and booking yields.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property Listing</span>
        </button>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Net Yield</p>
            <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">${stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Listings</p>
            <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">{stats.totalProperties}</h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reservations</p>
            <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">{stats.totalBookings}</h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</p>
            <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">{stats.pendingBookings}</h3>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Recharts Area Graph */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">Monthly Earnings Performance</h3>
          <p className="text-xs text-slate-500">Gross revenue delivered from verified guest stays (in USD)</p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyEarnings} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip
                formatter={(val: any) => [`$${val.toLocaleString()}`, 'Earnings']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#f43f5e" strokeWidth={3} fill="url(#earningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">My Property Listings</h3>
            <p className="text-xs text-slate-500">Manage rates, review feedback, and status of your sanctuaries</p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">{properties.length} Total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Property</th>
                <th className="p-4">Category</th>
                <th className="p-4">Nightly Price</th>
                <th className="p-4">Moderation Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    You have not listed any properties yet. Click &ldquo;Add New Property Listing&rdquo; above.
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{prop.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {prop.location.city}, {prop.location.state}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {prop.category}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 font-['Outfit'] text-sm">
                      ${prop.pricePerNight}
                    </td>

                    <td className="p-4">
                      {prop.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {prop.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock className="w-3.5 h-3.5" /> Under Review
                        </span>
                      )}
                      {prop.status === 'rejected' && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3.5 h-3.5" /> Rejected
                          </span>
                          <button
                            onClick={() => setViewFeedbackProp(prop)}
                            className="text-xs font-semibold text-rose-600 underline hover:text-rose-700"
                          >
                            View Feedback
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prop.averageRating > 0 ? prop.averageRating.toFixed(1) : 'New'}</span>
                      </div>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleDeleteProperty(prop._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incoming Guest Booking Requests */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">Guest Booking Requests</h3>
          <p className="text-xs text-slate-500">Reservations awaiting confirmation or payment verification</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">Traveler</th>
                <th className="p-4">Sanctuary</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No booking requests received yet.
                  </td>
                </tr>
              ) : (
                bookings.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50/70">
                    <td className="p-4 pl-6 font-bold text-slate-900">{book.tenantName}</td>
                    <td className="p-4 truncate max-w-xs">{book.propertyTitle}</td>
                    <td className="p-4">
                      {book.checkIn} → {book.checkOut} ({book.totalNights}n)
                    </td>
                    <td className="p-4 font-bold text-slate-900 font-['Outfit']">
                      ${book.pricing.totalAmount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          book.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : book.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      {book.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleBookingAction(book._id, 'accept')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleBookingAction(book._id, 'decline')}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-100"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {book.status === 'confirmed' && (
                        <span className="text-[11px] text-emerald-600 font-bold">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <h3 className="font-extrabold text-xl text-slate-900 font-['Outfit'] mb-1">
              List a New Luxury Property
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Submissions undergo fast administrative verification before appearing in search results.
            </p>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    placeholder="E.g., The Glass Pavilion & Heated Pool"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProp.category}
                    onChange={(e) => setNewProp({ ...newProp, category: e.target.value as PropertyCategory })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Cabin">Cabin</option>
                    <option value="Cottage">Cottage</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nightly Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={newProp.pricePerNight}
                    onChange={(e) => setNewProp({ ...newProp, pricePerNight: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newProp.city}
                    onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={newProp.state}
                    onChange={(e) => setNewProp({ ...newProp, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProp.bedrooms}
                      onChange={(e) => setNewProp({ ...newProp, bedrooms: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProp.bathrooms}
                      onChange={(e) => setNewProp({ ...newProp, bathrooms: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Max Guests</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProp.maxGuests}
                      onChange={(e) => setNewProp({ ...newProp, maxGuests: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URLs (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newProp.images}
                    onChange={(e) => setNewProp({ ...newProp, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newProp.amenities}
                    onChange={(e) => setNewProp({ ...newProp, amenities: e.target.value })}
                    placeholder="Infinity Pool, High-Speed WiFi, Ocean View..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newProp.description}
                    onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                    placeholder="Highlight architecture, views, and bespoke touches..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProperty}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isSubmittingProperty ? 'Submitting...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Feedback View Modal */}
      {viewFeedbackProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-['Outfit']">Admin Review Feedback</h3>
                <p className="text-[11px] text-slate-500">{viewFeedbackProp.title}</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-950 leading-relaxed">
              <p className="font-bold mb-1">Reason for Rejection:</p>
              <p>{viewFeedbackProp.rejectionFeedback || 'No specific notes recorded by admin.'}</p>
            </div>

            <button
              onClick={() => setViewFeedbackProp(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
