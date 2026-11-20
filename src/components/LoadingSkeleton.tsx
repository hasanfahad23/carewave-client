'use client';

import React from 'react';

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="event-card animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="h-52 bg-gray-200 dark:bg-gray-800 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/5 mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-4" />
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded w-28" />
        </div>
      </div>
    </div>
  );
};

export const EventGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const EventDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-pulse">
      <div className="w-full h-80 md:h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full mt-6" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 gap-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        </div>
      ))}
    </div>
  );
};
