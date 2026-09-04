import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Check, DollarSign } from 'lucide-react';
import { PropertyCategory } from '../types/index.ts';

interface SearchFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  bedrooms: string;
  setBedrooms: (val: string) => void;
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  sort: string;
  setSort: (val: string) => void;
  onReset: () => void;
}

const CATEGORIES: Array<'All' | PropertyCategory> = [
  'All',
  'Villa',
  'Apartment',
  'Cabin',
  'Penthouse',
  'Cottage',
  'Studio',
];

const AMENITY_OPTIONS = [
  'High-Speed WiFi',
  'Air Conditioning',
  'Infinity Pool',
  'Hot Tub',
  'Chef Kitchen',
  'Ocean View',
  'Mountain View',
  'Free Parking',
  'EV Charger',
  'Pet Friendly',
  'Workspace',
  'Fireplace',
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  bedrooms,
  setBedrooms,
  selectedAmenities,
  setSelectedAmenities,
  sort,
  setSort,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const hasActiveFilters =
    Boolean(search) ||
    category !== 'All' ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(bedrooms) ||
    selectedAmenities.length > 0 ||
    sort !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 md:p-6 mb-8">
      {/* Top Bar: Search Input & Category Pills */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city, title, or location (e.g. Malibu, New York, Aspen)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
        </div>

        {/* Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-rose-500"
          >
            <option value="newest">Sort: Newest Added</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showAdvanced || selectedAmenities.length > 0 || minPrice || maxPrice || bedrooms
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {(selectedAmenities.length > 0 || minPrice || maxPrice || bedrooms) && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nightly Price ($)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-7 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-slate-400 text-xs">—</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-7 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Minimum Bedrooms
            </label>
            <div className="flex items-center gap-1.5">
              {['', '1', '2', '3', '4+'].map((opt) => {
                const isSelected = bedrooms === (opt === '4+' ? '4' : opt);
                return (
                  <button
                    key={opt || 'any'}
                    onClick={() => setBedrooms(opt === '4+' ? '4' : opt)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt === '' ? 'Any' : opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Popular Amenities & Features
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      checked
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {checked ? <Check className="w-3.5 h-3.5 text-rose-600" /> : null}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
