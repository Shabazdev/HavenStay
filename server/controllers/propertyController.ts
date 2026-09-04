import { Request, Response } from 'express';
import { dbStore } from '../config/db.ts';
import { AuthRequest } from '../middleware/auth.ts';
import { SeedProperty } from '../seedData.ts';

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      category = '',
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      guests,
      amenities,
      sort = 'newest',
      page = '1',
      limit = '9',
      status = 'approved',
    } = req.query;

    let filtered: SeedProperty[] = [...dbStore.properties];

    // Status filter: by default public only sees 'approved'
    if (status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Search filter
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.location.state.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range
    if (minPrice) {
      filtered = filtered.filter((p) => p.pricePerNight >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.pricePerNight <= Number(maxPrice));
    }

    // Bedrooms
    if (bedrooms) {
      filtered = filtered.filter((p) => p.bedrooms >= Number(bedrooms));
    }

    // Bathrooms
    if (bathrooms) {
      filtered = filtered.filter((p) => p.bathrooms >= Number(bathrooms));
    }

    // Guests
    if (guests) {
      filtered = filtered.filter((p) => p.maxGuests >= Number(guests));
    }

    // Amenities (comma-separated list)
    if (amenities && typeof amenities === 'string' && amenities.trim() !== '') {
      const requestedAmenities = amenities.split(',').map((a) => a.trim().toLowerCase());
      filtered = filtered.filter((p) => {
        const propertyAmenities = p.amenities.map((a) => a.toLowerCase());
        return requestedAmenities.every((ra) => propertyAmenities.some((pa) => pa.includes(ra)));
      });
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 9);
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      properties: paginated,
      pagination: {
        total: totalCount,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error: any) {
    console.error('getProperties error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve properties.' });
  }
};

export const getFeaturedProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const featured = dbStore.properties
      .filter((p) => p.status === 'approved')
      .slice(0, 6);

    res.status(200).json({ success: true, properties: featured });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to get featured properties.' });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = dbStore.properties.find((p) => p._id === id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    const reviews = dbStore.reviews.filter((r) => r.propertyId === id);

    res.status(200).json({
      success: true,
      property,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving property details.' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      title,
      description,
      category,
      address,
      city,
      state,
      country,
      zipCode,
      pricePerNight,
      bedrooms,
      bathrooms,
      maxGuests,
      squareFeet,
      amenities = [],
      images = [],
    } = req.body;

    if (!title || !description || !category || !pricePerNight || !city || !address) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    const userInDb = dbStore.users.find((u) => u._id === req.user?.id);

    const defaultPhotos = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
    ];

    const finalImages = Array.isArray(images) && images.length > 0 ? images : defaultPhotos;

    const newProperty: SeedProperty = {
      _id: `prop_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      location: {
        address: address.trim(),
        city: city.trim(),
        state: state?.trim() || 'CA',
        country: country?.trim() || 'United States',
        zipCode: zipCode?.trim() || '90210',
        lat: 34.0522,
        lng: -118.2437,
      },
      pricePerNight: Number(pricePerNight),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      maxGuests: Number(maxGuests) || 2,
      squareFeet: Number(squareFeet) || 1200,
      amenities: Array.isArray(amenities) ? amenities : ['High-Speed WiFi', 'Air Conditioning'],
      images: finalImages,
      owner: {
        id: req.user.id,
        name: userInDb?.name || req.user.name,
        email: userInDb?.email || req.user.email,
        avatar: userInDb?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        phone: userInDb?.phone || '+1 (555) 000-0000',
      },
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      featured: false,
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.properties.unshift(newProperty);

    res.status(201).json({
      success: true,
      message: 'Property submitted successfully! It is currently pending Admin review.',
      property: newProperty,
    });
  } catch (error: any) {
    console.error('createProperty error:', error);
    res.status(500).json({ success: false, message: 'Failed to create property.' });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const property = dbStore.properties.find((p) => p._id === id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    // RBAC check: Only the owner of this property or an admin can update
    if (property.owner.id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You do not have permission to modify this property.' });
      return;
    }

    const updates = req.body;
    if (updates.title) property.title = updates.title.trim();
    if (updates.description) property.description = updates.description.trim();
    if (updates.category) property.category = updates.category;
    if (updates.pricePerNight) property.pricePerNight = Number(updates.pricePerNight);
    if (updates.bedrooms) property.bedrooms = Number(updates.bedrooms);
    if (updates.bathrooms) property.bathrooms = Number(updates.bathrooms);
    if (updates.maxGuests) property.maxGuests = Number(updates.maxGuests);
    if (updates.amenities) property.amenities = updates.amenities;
    if (updates.images && Array.isArray(updates.images)) property.images = updates.images;
    if (updates.location) {
      property.location = { ...property.location, ...updates.location };
    }

    // If edited by owner, reset status to pending for re-approval
    if (req.user.role !== 'admin') {
      property.status = 'pending';
      property.rejectionFeedback = '';
    }

    property.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      property,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update property.' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const index = dbStore.properties.findIndex((p) => p._id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    const property = dbStore.properties[index];
    if (property.owner.id !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this property.' });
      return;
    }

    dbStore.properties.splice(index, 1);

    res.status(200).json({ success: true, message: 'Property deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete property.' });
  }
};

export const moderateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin authorization required.' });
      return;
    }

    const { id } = req.params;
    const { action, rejectionFeedback = '' } = req.body; // 'approve' | 'reject'

    const property = dbStore.properties.find((p) => p._id === id);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    if (action === 'approve') {
      property.status = 'approved';
      property.rejectionFeedback = '';
    } else if (action === 'reject') {
      property.status = 'rejected';
      property.rejectionFeedback = rejectionFeedback.trim() || 'Property does not meet safety or documentation standards.';
    } else {
      res.status(400).json({ success: false, message: "Invalid action. Use 'approve' or 'reject'." });
      return;
    }

    property.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      property,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to moderate property.' });
  }
};

export const getOwnerProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const properties = dbStore.properties.filter((p) => p.owner.id === req.user?.id);
    res.status(200).json({ success: true, properties });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to get owner properties.' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { propertyId } = req.body;
    if (!propertyId) {
      res.status(400).json({ success: false, message: 'Property ID required' });
      return;
    }

    const userId = req.user.id;
    if (!dbStore.favorites[userId]) {
      dbStore.favorites[userId] = [];
    }

    const userFavs = dbStore.favorites[userId];
    const existsIndex = userFavs.indexOf(propertyId);
    let isFavorite = false;

    if (existsIndex > -1) {
      userFavs.splice(existsIndex, 1);
      isFavorite = false;
    } else {
      userFavs.push(propertyId);
      isFavorite = true;
    }

    res.status(200).json({
      success: true,
      isFavorite,
      favorites: userFavs,
      message: isFavorite ? 'Added to favorites' : 'Removed from favorites',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to toggle favorite.' });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const favIds = dbStore.favorites[req.user.id] || [];
    const favoriteProperties = dbStore.properties.filter((p) => favIds.includes(p._id));

    res.status(200).json({ success: true, favoriteIds: favIds, properties: favoriteProperties });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to get favorites.' });
  }
};
