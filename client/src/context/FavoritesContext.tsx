import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext.tsx';
import { api, showToast } from '../services/api.ts';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Favorites are fetched from the server for the authenticated user only.
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          setIsLoading(true);
          const res = await api.get('/properties/user/favorites');
          if (res.data.success) {
            setFavorites(res.data.favoriteIds || []);
          }
        } catch (err) {
          // Ignore — the heart icons simply stay empty on a failed fetch.
        } finally {
          setIsLoading(false);
        }
      };
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user?._id]);

  const isFavorite = useCallback((propertyId: string) => favorites.includes(propertyId), [favorites]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      showToast('Please sign in to save favorite properties.', 'info');
      return;
    }

    try {
      const res = await api.post('/properties/user/favorites/toggle', { propertyId });
      if (res.data.success) {
        setFavorites(res.data.favorites);
        showToast(res.data.message, 'success');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        showToast('Please sign in to save favorite properties.', 'info');
      } else {
        showToast('Failed to update favorites', 'error');
      }
    }
  };

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, isLoading }),
    [favorites, isFavorite, toggleFavorite, isLoading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
