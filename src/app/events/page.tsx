'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Calendar, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { EventItem, EventType } from '../../types';
import { EventCard } from '../../components/EventCard';
import { EventGridSkeleton } from '../../components/LoadingSkeleton';

const EVENT_CATEGORIES: (EventType | 'All')[] = [
  'All',
  'Donation',
  'Plantation',
  'Cleanup',
  'Food Relief',
  'Healthcare',
  'Education',
  'Blood Donation',
  'Disaster Relief',
];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let query = `?sort=${sortOrder}`;
      if (selectedType !== 'All') {
        query += `&type=${encodeURIComponent(selectedType)}`;
      }
      if (searchTerm.trim() !== '') {
        query += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const res = await apiRequest(`/events${query}`);
      if (res.success && res.data) {
        // Enforce frontend filter as well to strictly guarantee no passed dates appear
        const now = new Date();
        const upcomingOnly = res.data.filter((item: EventItem) => {
          const evtDate = new Date(item.eventDate);
          return evtDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
        });
        setEvents(upcomingOnly);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedType, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Active Service Calendar
        </div>
        <h1 className="section-heading">
          All Upcoming Events
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Discover all upcoming community campaigns, relief drives, and environmental initiatives. All events displayed here are actively accepting volunteer signups.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm space-y-4">
        
        {/* Search Bar + Sort Order */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event title, location, or area (e.g. Mirpur, Dhanmondi, Tree)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="btn-primary py-2.5 px-5 text-sm shrink-0 cursor-pointer"
            >
              Search
            </button>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              aria-label="Sort events by date"
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="asc">Earliest Date First</option>
              <option value="desc">Latest Date First</option>
            </select>
          </div>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedType(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === category
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Events Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <p>
          Showing <span className="font-bold text-gray-900 dark:text-white">{events.length}</span> upcoming event{events.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={fetchEvents}
          className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh List
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <EventGridSkeleton count={6} />
      ) : events.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl space-y-4">
          <Layers className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No Upcoming Events Match Your Search
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your category filter or search keywords. You can also organize a new community event yourself!
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All');
              }}
              className="btn-secondary text-sm mr-3"
            >
              Reset Filters
            </button>
            <a href="/create-event" className="btn-primary text-sm">
              Create an Event
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

    </div>
  );
}
