import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading HavenStay...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-rose-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide animate-pulse">{label}</p>
    </div>
  );
};

export const PropertySkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};
