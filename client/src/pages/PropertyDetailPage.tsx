import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Users,
  Maximize2,
  Check,
  ShieldCheck,
  Calendar,
  Lock,
  MessageSquare,
  Sparkles,
  Wifi,
  Wind,
  Coffee,
  Tv,
  Car,
  ChevronLeft,
} from 'lucide-react';
import { Property, Review, Booking } from '../types/index.ts';
import { api, showToast } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { StripePaymentModal } from '../components/StripePaymentModal.tsx';
import { ReviewModal } from '../components/ReviewModal.tsx';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  // Booking Calculator State
  const today = new Date();
  const defaultCheckIn = new Date(today.setDate(today.getDate() + 4)).toISOString().split('T')[0];
  const defaultCheckOut = new Date(today.setDate(today.getDate() + 4)).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState(2);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Modals
  const [activeBookingForPayment, setActiveBookingForPayment] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const res = await api.get(`/properties/item/${id}`);
        if (res.data.success) {
          setProperty(res.data.property);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        showToast('Property not found', 'error');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPropertyDetails();
  }, [id, navigate]);

  if (loading || !property) {
    return <LoadingSpinner label="Loading sanctuary details..." />;
  }

  // Calculate pricing math
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffTime = endDate.getTime() - startDate.getTime();
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const subtotal = property.pricePerNight * nights;
  const cleaningFee = Math.round(property.pricePerNight * 0.18);
  const serviceFee = Math.round(subtotal * 0.08);
  const taxes = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + cleaningFee + serviceFee + taxes;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in as a Tenant to reserve this residence.', 'info');
      navigate('/login');
      return;
    }

    if (user.role === 'owner' && property.owner.id === user._id) {
      showToast('You cannot book your own property listing.', 'warning');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await api.post('/bookings', {
        propertyId: property._id,
        checkIn,
        checkOut,
        guestsCount,
      });

      if (res.data.success) {
        showToast('Reservation request created! Proceeding to Stripe payment.', 'success');
        setActiveBookingForPayment(res.data.booking);
        setIsPaymentModalOpen(true);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create booking.', 'error');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleReviewSuccess = (newReview: Review, avgRating: number, totalReviews: number) => {
    setReviews([newReview, ...reviews]);
    setProperty({
      ...property,
      averageRating: avgRating,
      totalReviews,
    });
  };

  const handlePaymentSuccess = (updatedBooking: Booking) => {
    navigate('/dashboard/tenant');
  };

  const isFav = isFavorite(property._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Stays</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => toggleFavorite(property._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            {property.category}
          </span>
          {property.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Superhost Sanctuary
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          {property.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{property.averageRating > 0 ? property.averageRating.toFixed(2) : 'New'}</span>
            <span className="text-slate-400 font-normal">({property.totalReviews} reviews)</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>
              {property.location.address}, {property.location.city}, {property.location.state}
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-[16/9] max-h-[500px]">
        {/* Main Large Photo */}
        <div className="md:col-span-2 relative h-full">
          <img
            src={property.images[activePhoto] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          />
        </div>

        {/* 2 Smaller side photos */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {property.images.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={`relative overflow-hidden cursor-pointer transition-all ${
                activePhoto === idx ? 'ring-4 ring-rose-500 rounded-2xl' : 'hover:opacity-90'
              }`}
            >
              <img src={img} alt={`${property.title} ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Left Details vs Right Sticky Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Host Overview Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/20"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">Hosted by {property.owner.name}</h3>
                <p className="text-xs text-slate-500">Superhost • 100% response rate within 1 hour</p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200">
              Identity Verified
            </span>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-4 gap-3 py-4 border-y border-slate-200/80 text-center">
            <div className="space-y-1">
              <Bed className="w-5 h-5 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-800">{property.bedrooms} Bedrooms</p>
            </div>
            <div className="space-y-1">
              <Bath className="w-5 h-5 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-800">{property.bathrooms} Bathrooms</p>
            </div>
            <div className="space-y-1">
              <Users className="w-5 h-5 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-800">{property.maxGuests} Guests Max</p>
            </div>
            <div className="space-y-1">
              <Maximize2 className="w-5 h-5 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-800">{property.squareFeet} Sq Ft</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">About this sanctuary</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80">
            <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">What this place offers</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{property.averageRating > 0 ? property.averageRating.toFixed(2) : 'No reviews yet'}</span>
                  <span className="text-slate-400 font-normal text-sm">({property.totalReviews} guest reviews)</span>
                </h3>
              </div>

              {user?.role === 'tenant' && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </button>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  Be the first traveler to stay and review this sanctuary!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                          <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-3xl font-black text-slate-900 font-['Outfit']">${property.pricePerNight}</span>
                <span className="text-xs text-slate-500 font-semibold"> / night</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.averageRating > 0 ? property.averageRating.toFixed(2) : 'New'}</span>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="border-l border-slate-200 pl-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Guests</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full p-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>
                    ${property.pricePerNight} × {nights} nights
                  </span>
                  <span className="font-semibold">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sanitization & Cleaning Fee</span>
                  <span className="font-semibold">${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>HavenStay Escrow Service Fee</span>
                  <span className="font-semibold">${serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy Taxes</span>
                  <span className="font-semibold">${taxes}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Total Due (USD)</span>
                  <span className="text-rose-600 font-['Outfit'] text-lg">${totalAmount}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-xl shadow-rose-600/25 transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingBooking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Reserve & Pay with Stripe</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-slate-400 text-[11px] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>You won&apos;t be billed until reviewing final card details.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {activeBookingForPayment && (
        <StripePaymentModal
          booking={activeBookingForPayment}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        propertyId={property._id}
        propertyTitle={property.title}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};
