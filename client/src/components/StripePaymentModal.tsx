import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Booking } from '../types/index.ts';
import { api, showToast } from '../services/api.ts';

interface StripePaymentModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBooking: Booking) => void;
}

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(booking.tenantName || '');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const fillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardName('Test Traveler');
    setExpiry('10/29');
    setCvc('424');
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Create Payment Intent
      const intentRes = await api.post('/payments/create-payment-intent', {
        bookingId: booking._id,
      });

      const paymentIntentId = intentRes.data.paymentIntentId;

      // 2. Confirm Payment
      const confirmRes = await api.post('/payments/confirm-payment', {
        bookingId: booking._id,
        paymentIntentId,
        paymentMethod: 'visa_card_4242',
      });

      if (confirmRes.data.success) {
        showToast('Payment successful! Your reservation is confirmed.', 'success');
        onSuccess(confirmRes.data.booking);
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Payment processing failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Stripe Escrow Checkout</h3>
              <p className="text-[11px] text-slate-500">256-Bit SSL Encrypted Payment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Reservation Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3.5 items-center">
            {booking.propertyImage && (
              <img
                src={booking.propertyImage}
                alt={booking.propertyTitle}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">{booking.propertyTitle}</h4>
              <p className="text-[11px] text-slate-500">
                {booking.checkIn} → {booking.checkOut} ({booking.totalNights} nights)
              </p>
              <p className="text-xs font-black text-slate-900 mt-1">
                Total Due: <span className="text-rose-600">${booking.pricing.totalAmount}</span>
              </p>
            </div>
          </div>

          {/* Fill Test Card Quick Button */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Credentials</span>
            <button
              type="button"
              onClick={fillTestCard}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Test Card</span>
            </button>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-mono"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">VISA</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">CVC / CVV</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing with Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ${booking.pricing.totalAmount} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Funds held securely in HavenStay Escrow until 24h after check-in.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
