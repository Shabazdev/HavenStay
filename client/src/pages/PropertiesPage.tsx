import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, SlidersHorizontal, ChevronLeft, ChevronRight, AlertCircle, Building2 } from 'lucide-react';
import { Property, PaginationData } from '../types/index.ts';
import { api } from '../services/api.ts';
import { PropertyCard } from '../components/PropertyCard.tsx';
import { SearchFilterBar } from '../components/SearchFilterBar.tsx';
import { PropertySkeletonCard } from '../components/LoadingSpinner.tsx';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : []
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
  });
  const [loading, setLoading] = useState(true);

  // Fetch properties from backend whenever filters or page changes
  useEffect(() => {
    const fetchFilteredProperties = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (category && category !== 'All') query.set('category', category);
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);
        if (bedrooms) query.set('bedrooms', bedrooms);
        if (selectedAmenities.length > 0) query.set('amenities', selectedAmenities.join(','));
        if (sort) query.set('sort', sort);
        query.set('page', page.toString());
        query.set('limit', '9');
        query.set('status', 'approved');

        // Sync with browser URL
        setSearchParams(query, { replace: true });

        const res = await api.get(`/properties?${query.toString()}`);
        if (res.data.success) {
          setProperties(res.data.properties);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [search, category, minPrice, maxPrice, bedrooms, selectedAmenities, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSelectedAmenities([]);
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Marketplace Discovery</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          Explore Premier Residences
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Showing {pagination.total} verified stays available for instant escrow booking.
        </p>
      </div>

      {/* Filter Bar */}
      <SearchFilterBar
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setPage(1);
        }}
        minPrice={minPrice}
        setMinPrice={(val) => {
          setMinPrice(val);
          setPage(1);
        }}
        maxPrice={maxPrice}
        setMaxPrice={(val) => {
          setMaxPrice(val);
          setPage(1);
        }}
        bedrooms={bedrooms}
        setBedrooms={(val) => {
          setBedrooms(val);
          setPage(1);
        }}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={(val) => {
          setSelectedAmenities(val);
          setPage(1);
        }}
        sort={sort}
        setSort={(val) => {
          setSort(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <PropertySkeletonCard key={n} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching residences found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, removing active price filters, or exploring other property categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      )}

      {/* Backend Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === pagination.currentPage;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
