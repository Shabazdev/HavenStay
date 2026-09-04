import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="relative inline-block">
          <div className="text-8xl font-black text-rose-500/20 font-['Outfit'] select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900 font-['Outfit']">Sanctuary Not Found</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          The luxury retreat or page you are searching for might have been moved, booked, or is undergoing architectural renovation.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/properties"
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-rose-600" />
            <span>Explore Stays</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
