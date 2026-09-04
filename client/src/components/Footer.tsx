import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, CreditCard, Sparkles, Heart, Mail, CheckCircle2 } from 'lucide-react';
import { showToast } from '../services/api.ts';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Thank you for subscribing to HavenStay Luxury Escapes!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl text-white font-['Outfit']">
                Haven<span className="text-rose-500">Stay</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curated architectural residences, waterfront villas, and alpine chalets. Seamlessly connecting discerning
              tenants with premier hosts worldwide.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Sanctuaries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Escrow Stripe Security</span>
              </div>
            </div>
          </div>

          {/* Col 3: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Stays</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/properties?category=Villa" className="hover:text-white transition-colors">
                  Cliffside Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Penthouse" className="hover:text-white transition-colors">
                  City Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Cabin" className="hover:text-white transition-colors">
                  Alpine Cabins
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Cottage" className="hover:text-white transition-colors">
                  Lakefront Cottages
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Host & Guest</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  Instant Booking Guide
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tenant" className="hover:text-white transition-colors">
                  Guest Protection Policy
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  Cancellation Flexibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Curated Newsletter</h4>
            <p className="text-xs text-slate-400">
              Receive secret weekend escapes and architectural showcases every Thursday.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 rounded-xl transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HavenStay, Inc. All rights reserved. MERN Production Architecture.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Trust & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
