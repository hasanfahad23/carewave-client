'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Tag, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Donation':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    case 'Plantation':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    case 'Cleanup':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800';
    case 'Education':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
    case 'Healthcare':
    case 'Blood Donation':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    default:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800';
  }
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="event-card group">
      {/* Thumbnail */}
      <div className="card-img-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getEventTypeColor(
              event.eventType
            )}`}
          >
            <Tag className="w-3.5 h-3.5" />
            {event.eventType}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Location */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2.5">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1 truncate max-w-[160px]" title={event.location}>
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {event.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
            {event.title}
          </h3>

          {/* Description snippet */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {event.description}
          </p>
        </div>

        {/* Footer Meta & Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                {event.participantCount || 0}
              </strong>{' '}
              volunteers joined
            </span>
          </div>

          <Link href={`/events/${event._id}`} className="btn-primary text-xs py-2 px-3.5">
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
