import { Router } from 'express';
import {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  moderateProperty,
  getOwnerProperties,
  toggleFavorite,
  getFavorites,
} from '../controllers/propertyController.ts';
import { requireAuth, authorizeRoles } from '../middleware/auth.ts';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/item/:id', getPropertyById);

// Favorites (Authenticated tenant/user)
router.get('/user/favorites', requireAuth, getFavorites);
router.post('/user/favorites/toggle', requireAuth, toggleFavorite);

// Owner routes
router.get('/owner/listings', requireAuth, authorizeRoles('owner', 'admin'), getOwnerProperties);
router.post('/', requireAuth, authorizeRoles('owner', 'admin'), createProperty);
router.put('/:id', requireAuth, authorizeRoles('owner', 'admin'), updateProperty);
router.delete('/:id', requireAuth, authorizeRoles('owner', 'admin'), deleteProperty);

// Admin moderation route
router.put('/:id/moderate', requireAuth, authorizeRoles('admin'), moderateProperty);

export default router;
