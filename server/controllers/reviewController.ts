import { Request, Response } from 'express';
import { dbStore } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { SeedReview } from '../seedData.ts';

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { propertyId, rating, comment, categories } = req.body;

    if (!propertyId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Property ID, rating, and comment are required.' });
      return;
    }

    const property = dbStore.properties.find((p) => p._id === propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    const userInDb = dbStore.users.find((u) => u._id === req.user?.id);

    const newReview: SeedReview = {
      _id: `rev_${Date.now()}`,
      propertyId,
      userId: req.user.id,
      userName: userInDb?.name || req.user.name,
      userAvatar: userInDb?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      rating: Number(rating),
      categories: {
        cleanliness: Number(categories?.cleanliness) || Number(rating),
        accuracy: Number(categories?.accuracy) || Number(rating),
        communication: Number(categories?.communication) || Number(rating),
        location: Number(categories?.location) || Number(rating),
        value: Number(categories?.value) || Number(rating),
      },
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    dbStore.reviews.unshift(newReview);

    // Recalculate property average rating
    const propertyReviews = dbStore.reviews.filter((r) => r.propertyId === propertyId);
    const sum = propertyReviews.reduce((acc, r) => acc + r.rating, 0);
    property.totalReviews = propertyReviews.length;
    property.averageRating = Number((sum / propertyReviews.length).toFixed(2));

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: newReview,
      averageRating: property.averageRating,
      totalReviews: property.totalReviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

export const getPropertyReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const reviews = dbStore.reviews.filter((r) => r.propertyId === propertyId);

    res.status(200).json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
};
