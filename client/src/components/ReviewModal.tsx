import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { api, showToast } from '../services/api.ts';
import { Review } from '../types/index.ts';

interface ReviewModalProps {
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReview: Review, avgRating: number, totalReviews: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [locationScore, setLocationScore] = useState(5);
  const [valueScore, setValueScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide your review feedback.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        propertyId,
        rating,
        comment,
        categories: {
          cleanliness,
          accuracy,
          communication,
          location: locationScore,
          value: valueScore,
        },
      });

      if (res.data.success) {
        showToast('Review submitted successfully!', 'success');
        onSuccess(res.data.review, res.data.averageRating, res.data.totalReviews);
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Write a Traveler Review</h3>
            <p className="text-[11px] text-slate-500 truncate max-w-xs">{propertyTitle}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star Rating Selector */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform active:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Ratings */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-600 block mb-1">Cleanliness: {cleanliness}/5</span>
              <input
                type="range"
                min="1"
                max="5"
                value={cleanliness}
                onChange={(e) => setCleanliness(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <span className="text-slate-600 block mb-1">Accuracy: {accuracy}/5</span>
              <input
                type="range"
                min="1"
                max="5"
                value={accuracy}
                onChange={(e) => setAccuracy(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <span className="text-slate-600 block mb-1">Communication: {communication}/5</span>
              <input
                type="range"
                min="1"
                max="5"
                value={communication}
                onChange={(e) => setCommunication(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <span className="text-slate-600 block mb-1">Location: {locationScore}/5</span>
              <input
                type="range"
                min="1"
                max="5"
                value={locationScore}
                onChange={(e) => setLocationScore(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Feedback</label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your stay, host hospitality, amenities, and unique highlights..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
