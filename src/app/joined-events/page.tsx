'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookmarkCheck, 
  Calendar, 
  MapPin, 
  Tag, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { JoinedEventItem } from '../../types';
import { TableSkeleton } from '../../components/LoadingSkeleton';

export default function JoinedEventsPage() {
  const { user } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<JoinedEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJoined = async () => {
    setLoading(true);
    try {
      // Backend returns events sorted by event date!
      const res = await apiRequest('/events/user/joined');
      if (res.success && res.data) {
        setJoinedEvents(res.data);
      }
    } catch (err) {
      console.error('Error fetching joined events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoined();
    }
  }, [user]);

  const handleCancelParticipation = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Cancel Volunteer Registration?',
      text: `Do you want to withdraw from "${eventTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, withdraw',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiRequest(`/events/${eventId}/join`, {
        method: 'DELETE',
      });

      if (res.success) {
        toast.success(res.message || 'Cancelled your participation.');
        setJoinedEvents((prev) => prev.filter((item) => item.eventId !== eventId));
      } else {
        toast.error(res.message || 'Failed to cancel.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Volunteer Engagements
          </div>
          <h1 className="section-heading">My Joined Events</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Track all the social service events you have signed up for. All events are chronological, sorted strictly by upcoming event date.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton rows={4} />
        ) : joinedEvents.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl space-y-4">
            <AlertCircle className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No Events Joined Yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              You haven&apos;t enrolled in any community relief drives yet. Discover events in need of passionate volunteers!
            </p>
            <div className="pt-2">
              <Link href="/events" className="btn-primary text-sm">
                Explore Upcoming Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map((item) => {
              const formattedDate = new Date(item.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={item._id} className="event-card group">
                  <div className="card-img-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.eventTitle}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-gray-900/90 text-emerald-600 dark:text-emerald-400 shadow-md">
                        {item.eventType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {item.eventTitle}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      <Link
                        href={`/events/${item.eventId}`}
                        className="btn-primary text-xs py-2 px-3"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => handleCancelParticipation(item.eventId, item.eventTitle)}
                        className="btn-secondary text-xs py-2 px-3 text-rose-600 hover:text-rose-700 hover:border-rose-300"
                        title="Cancel Participation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Leave</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
