import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  HelpCircle,
  Building,
  Key,
} from 'lucide-react';
import { Property } from '../types/index.ts';
import { api } from '../services/api.ts';
import { PropertyCard } from '../components/PropertyCard.tsx';
import { PropertySkeletonCard } from '../components/LoadingSpinner.tsx';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [locationQuery, setLocationQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties/featured');
        if (res.data.success) {
          setFeaturedProperties(res.data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationQuery) params.set('search', locationQuery);
    if (categoryQuery && categoryQuery !== 'All') params.set('category', categoryQuery);
    navigate(`/properties?${params.toString()}`);
  };

  const CATEGORY_CARDS = [
    {
      name: 'Villas',
      img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      count: '14 Sanctuaries',
    },
    {
      name: 'Penthouses',
      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      count: '9 Duplexes',
    },
    {
      name: 'Cabins',
      img: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=600&q=80',
      count: '18 Escapes',
    },
    {
      name: 'Cottages',
      img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80',
      count: '12 Waterfronts',
    },
  ];

  const FAQS = [
    {
      q: 'How does HavenStay protect guest reservations?',
      a: 'All transactions are held safely in 100% escrow via Stripe. Funds are only transferred to the host 24 hours after you successfully check in and verify the residence meets all listing standards.',
    },
    {
      q: 'Can I list my own luxury property as a Host?',
      a: 'Absolutely! Simply sign up or log in as an Owner, navigate to your Host Dashboard, and submit your property listing. Our safety team will review and approve your submission within 24 hours.',
    },
    {
      q: 'What is the cancellation policy?',
      a: 'Hosts choose between Flexible, Moderate, and Strict cancellation terms. You can cancel directly from your Tenant Dashboard up to 48 hours before check-in for a full refund on eligible stays.',
    },
    {
      q: 'Are all HavenStay properties verified for safety and quality?',
      a: 'Yes. Every property listing submitted by hosts must pass administrative review and satisfy strict photo fidelity, cleanliness, and security criteria before appearing on the public marketplace.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Architecture"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-300 text-xs font-semibold tracking-wide uppercase shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Curated Architectural Residences</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-['Outfit']"
          >
            Find your extraordinary <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-rose-300 to-pink-400">
              luxury sanctuary.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Handcrafted cliffside estates, high-rise penthouses, and serene alpine lodges with seamless Stripe escrow booking.
          </motion.p>

          {/* Interactive Search Box */}
          <motion.form
            onSubmit={handleHeroSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/40 max-w-3xl mx-auto text-left grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            {/* Location input */}
            <div className="sm:col-span-6 px-3 py-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destination</label>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Where are you going? (e.g. Malibu)"
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="sm:col-span-4 px-3 py-1 sm:border-l sm:border-slate-200">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
              <select
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer mt-0.5"
              >
                <option value="All">All Categories</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Cabin">Cabin</option>
                <option value="Cottage">Cottage</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span className="sm:hidden lg:inline">Search</span>
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* 2. Featured 6 Properties Showcase (Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Handpicked Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              Featured Luxury Residences
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">
              Verified by our architectural committee for exceptional design, panoramic views, and five-star hospitality.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 group shrink-0"
          >
            <span>Explore All 20+ Listings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Featured Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <PropertySkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Category Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Curated by Architecture & Atmosphere
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select your desired environment, from oceanfront infinity cliffs to snow-covered pine peaks.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/properties?category=${cat.name.slice(0, -1)}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] block shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-extrabold text-xl font-['Outfit']">{cat.name}</h3>
                <p className="text-xs text-rose-300 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Why Book With Us Section */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">The HavenStay Guarantee</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 font-['Outfit']">
              Engineered for absolute peace of mind
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Escrow Protected Payments</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your payment is held safely in escrow and only released to the host 24 hours after arrival, guaranteeing that the home matches the description.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">100% In-Person Verification</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every listing is vetted against 100+ inspection points including high-speed internet, premium linens, heating/cooling, and sound insulation.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">24/7 Dedicated Concierge</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our hospitality liaisons are on standby round the clock to arrange private chef services, airport transfers, or immediate rebooking assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Host CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 p-8 sm:p-14 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/40">
              Host Sanctuary Program
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] leading-tight">
              Turn your architectural residence into a premier income haven.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join Eleanor Vance, Marcus Sterling, and top global hosts earning average monthly revenues of $4,500+ with zero listing fees and complete damage protection.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-transform active:scale-95 text-center"
            >
              List Your Property
            </Link>
            <Link
              to="/properties"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Traveler Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Guest Perspectives</h2>
          <p className="text-sm text-slate-500 mt-1">What world travelers are saying about their stays.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;The Azure Horizon villa in Malibu exceeded all expectations. The infinity pool cantilevered over the Pacific at golden hour was pure magic. Eleanor Vance was a consummate host.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Sophia Chen"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Sophia Chen</p>
                <p className="text-[11px] text-slate-400">Stayed in Malibu, California</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;Booking through HavenStay was effortless. Stripe checkout was instant, and the Tribeca penthouse was spotlessly clean with 24/7 concierge assistance.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Liam Gallagher"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">David Mitchell</p>
                <p className="text-[11px] text-slate-400">Stayed in New York</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;The Nordic chalet in Aspen was an architectural masterpiece. Cedar barrel sauna, heated floors, and ski-in convenience made our family vacation unforgettable.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Amara Patel"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Amara Patel</p>
                <p className="text-[11px] text-slate-400">Stayed in Aspen, Colorado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-sm text-slate-800 hover:text-rose-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-rose-600' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
