import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Heart,
  User,
  LogOut,
  PlusCircle,
  ShieldAlert,
  Building2,
  Menu,
  X,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { UserRole } from '../types/index.ts';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'owner') return '/dashboard/owner';
    return '/dashboard/tenant';
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'owner':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'tenant':
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1 font-['Outfit']">
                Haven<span className="text-rose-600">Stay</span>
              </span>
              <span className="hidden sm:block text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                Luxury Rentals & Escapes
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-rose-600 bg-rose-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/properties'
                  ? 'text-rose-600 bg-rose-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Stays
            </Link>

            {user?.role === 'owner' && (
              <Link
                to="/dashboard/owner"
                className="px-4 py-2 rounded-full text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Manage Properties
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/dashboard/admin"
                className="px-4 py-2 rounded-full text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Favorites Icon */}
            <Link
              to="/dashboard/tenant"
              className="relative p-2.5 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Auth Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-rose-500/20">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                      {user.name}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-medium uppercase px-1.5 py-0.2 rounded border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span
                        className={`mt-1.5 inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      {user.role === 'admin'
                        ? 'Admin Control Center'
                        : user.role === 'owner'
                        ? 'Host Dashboard'
                        : 'Tenant Dashboard'}
                    </Link>

                    {user.role === 'tenant' && (
                      <Link
                        to="/dashboard/tenant"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        My Favorites & Bookings
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setMobileMenuOpen(false);
                        logout().then(() => navigate('/'));
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition-all hover:shadow"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Explore Properties
          </Link>

          {user && (
            <Link
              to={getDashboardLink()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-rose-600 bg-rose-50"
            >
              Go to Dashboard ({user.role})
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout().then(() => navigate('/'));
                }}
                className="w-full py-2 text-center text-sm font-medium text-rose-600 bg-rose-50 rounded-xl"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-medium text-white bg-rose-600 rounded-xl"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
