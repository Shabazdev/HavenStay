import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Heart, MapPin, Users, Bed, Bath, Sparkles } from 'lucide-react';
import { Property } from '../types/index.ts';
import { useFavorites } from '../context/FavoritesContext.tsx';

interface PropertyCardProps {
  property: Property;
  showStatus?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, showStatus = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property._id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">Rejected</span>;
      case 'pending':
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Pending Review</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <Link to={`/properties/${property._id}`} className="relative aspect-[4/3] overflow-hidden block bg-slate-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
              {property.category}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1 bg-rose-600 text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          {/* Heart Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>
        </div>

        {/* Bottom Location Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{property.location.city}, {property.location.state || property.location.country}</span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Status badge if requested */}
          {showStatus && <div className="mb-2">{getStatusBadge(property.status)}</div>}

          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-2">
            <Link to={`/properties/${property._id}`} className="hover:text-rose-600 transition-colors">
              <h3 className="font-bold text-base text-slate-900 line-clamp-1 leading-snug">
                {property.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
              {property.totalReviews > 0 && (
                <span className="text-[10px] text-slate-400 font-normal">({property.totalReviews})</span>
              )}
            </div>
          </div>

          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {property.description}
          </p>

          {/* Specs: Bedrooms, Bathrooms, Guests */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.maxGuests} Guests</span>
            </div>
          </div>
        </div>

        {/* Footer: Price & View CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-slate-900 font-['Outfit']">${property.pricePerNight}</span>
            <span className="text-xs text-slate-500 font-medium"> / night</span>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="text-xs font-semibold text-rose-600 group-hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            Check Availability →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
