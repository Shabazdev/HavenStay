import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { PropertiesPage } from './pages/PropertiesPage.tsx';
import { PropertyDetailPage } from './pages/PropertyDetailPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { TenantDashboard } from './pages/TenantDashboard.tsx';
import { OwnerDashboard } from './pages/OwnerDashboard.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 selection:bg-rose-500 selection:text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Role-Protected Routes */}
                <Route
                  path="/dashboard/tenant"
                  element={
                    <ProtectedRoute allowedRoles={['tenant', 'admin']}>
                      <TenantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/owner"
                  element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
