import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { api, showToast } from '../services/api.ts';
import { Property } from '../types/index.ts';

interface RejectionModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProperty: Property) => void;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !property) return null;

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      showToast('Please provide a reason or constructive feedback for the host.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.put(`/properties/${property._id}/moderate`, {
        action: 'reject',
        rejectionFeedback: feedback.trim(),
      });

      if (res.data.success) {
        showToast('Property rejected with feedback delivered to host.', 'success');
        onSuccess(res.data.property);
        setFeedback('');
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reject property.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Reject Property Listing</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{property.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleReject} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please explain why this listing does not satisfy HavenStay publication guidelines. This feedback will be displayed in the host&apos;s dashboard so they can remedy the issues.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rejection Reason & Required Actions</label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="E.g., High-resolution photos needed of master bedroom; local short-term rental permit verification required..."
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
              {isSubmitting ? 'Submitting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
