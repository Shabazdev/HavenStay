import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Heart,
  User,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { Booking, Property } from '../types/index.ts';
import { api, showToast, showConfirmDialog } from '../services/api.ts';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { StripePaymentModal } from '../components/StripePaymentModal.tsx';
import { PropertyCard } from '../components/PropertyCard.tsx';

export const TenantDashboard: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { favorites } = useFavorites();

  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'profile'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Stripe Payment modal state
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Bookings
      const bookRes = await api.get('/bookings/my-bookings');
      if (bookRes.data.success) {
        setBookings(bookRes.data.bookings);
      }

      // 2. Fetch Favorite Properties details
      const favRes = await api.get('/properties/user/favorites');
      if (favRes.data.success) {
        setFavoriteProperties(favRes.data.properties || []);
      }
    } catch (err) {
      console.error('Error fetching tenant dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = await showConfirmDialog(
      'Cancel this reservation?',
      'The property will be released and any paid amount will be refunded to the original payment method.',
      'Yes, cancel it',
      true
    );
    if (!confirmed.isConfirmed) return;
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        showToast('Reservation has been cancelled.', 'success');
        setBookings(bookings.map((b) => (b._id === bookingId ? res.data.booking : b)));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel booking.', 'error');
    }
  };

  const handlePaymentSuccess = (updatedBooking: Booking) => {
    setBookings(bookings.map((b) => (b._id === updatedBooking._id ? updatedBooking : b)));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const result = await updateUserProfile({ name, phone, bio });
    setIsSavingProfile(false);
    if (result.ok) {
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(result.message || 'Failed to update profile.', 'error');
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Pending Payment
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading traveler dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-500/20"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email} • Verified HavenStay Traveler</p>
            <span className="mt-1 inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Tenant Account
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l sm:border-slate-100 pt-4 sm:pt-0 sm:pl-8">
          <div>
            <p className="text-xl font-extrabold text-slate-900 font-['Outfit']">{bookings.length}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Trips</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 font-['Outfit']">{favorites.length}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Saved Homes</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'bookings'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Reservations ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'favorites'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'profile'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Security</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Reservations Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ready to plan your next architectural getaway? Explore our luxury catalog now.
              </p>
              <Link
                to="/properties"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-600/20"
              >
                Browse Stays
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {booking.propertyImage && (
                      <img
                        src={booking.propertyImage}
                        alt={booking.propertyTitle}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <span className="text-[11px] text-slate-400">ID: {booking._id.slice(-6)}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{booking.propertyTitle}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">
                          {booking.checkIn} → {booking.checkOut}
                        </span>
                        <span>•</span>
                        <span>{booking.totalNights} Nights</span>
                        <span>•</span>
                        <span>{booking.guestsCount} Guests</span>
                      </div>
                      <p className="text-xs font-black text-slate-900 font-['Outfit']">
                        Total: <span className="text-rose-600">${booking.pricing.totalAmount}</span>
                        {booking.paymentStatus === 'paid' && (
                          <span className="ml-2 text-[10px] font-bold text-emerald-600 uppercase">
                            • Paid with Stripe
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    <Link
                      to={`/properties/${booking.propertyId}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <span>View Listing</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedBookingForPayment(booking);
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-transform active:scale-95 flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Complete Payment</span>
                      </button>
                    )}

                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Saved Residences</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tap the heart icon on any property card to build your wish list.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">Personal Information</h3>
            <p className="text-xs text-slate-500">Update your verified traveler identity details.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">About Me</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Frequent traveler who loves ocean views and modern architecture..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Payment Modal */}
      {selectedBookingForPayment && (
        <StripePaymentModal
          booking={selectedBookingForPayment}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
