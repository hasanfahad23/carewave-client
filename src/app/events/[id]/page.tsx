'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  HeartHandshake, 
  Share2, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Mail, 
  User as UserIcon,
  Copy,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import { EventItem } from '../../../types';
import { EventDetailsSkeleton } from '../../../components/LoadingSkeleton';

// New X logo SVG
const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const userParam = user ? `?userEmail=${encodeURIComponent(user.email)}` : '';
      const res = await apiRequest(`/events/${eventId}${userParam}`);
      if (res.success && res.data) {
        setEvent(res.data);
        setHasJoined(!!res.data.hasJoined);
      } else {
        toast.error('Event not found or has been removed.');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, user]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error('Please log in to join this community event.');
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    setJoining(true);
    try {
      const res = await apiRequest(`/events/${eventId}/join`, {
        method: 'POST',
      });

      if (res.success) {
        setHasJoined(true);
        setEvent((prev) => prev ? { ...prev, participantCount: (prev.participantCount || 0) + 1 } : null);
        Swal.fire({
          icon: 'success',
          title: 'Participation Confirmed!',
          text: res.message || 'You have successfully joined the event as a volunteer!',
          confirmButtonColor: '#059669',
        });
      } else {
        toast.error(res.message || 'Failed to join event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred while joining.');
    } finally {
      setJoining(false);
    }
  };

  const handleCancelParticipation = async () => {
    const confirm = await Swal.fire({
      title: 'Cancel Participation?',
      text: 'Are you sure you want to withdraw your volunteer signup for this event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await apiRequest(`/events/${eventId}/join`, {
        method: 'DELETE',
      });

      if (res.success) {
        setHasJoined(false);
        setEvent((prev) => prev ? { ...prev, participantCount: Math.max(0, (prev.participantCount || 1) - 1) } : null);
        toast.success('Your participation has been cancelled.');
      } else {
        toast.error(res.message || 'Failed to cancel participation.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred.');
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The event you are looking for does not exist or may have been concluded.
        </p>
        <Link href="/events" className="btn-primary inline-flex mt-4">
          Back to Upcoming Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Upcoming Events</span>
        </Link>
      </div>

      {/* Main Banner Image Container */}
      <div className="relative w-full h-80 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        
        {/* Banner Details Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md">
              {event.eventType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {formattedDate}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight drop-shadow-md">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Grid Layout: Left Details + Right Registration Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Description, Location, Organizer info */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Info Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Event Location</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Volunteer Count</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                  {event.participantCount || 0} changemakers enrolled
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              About This Initiative
            </h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Organizer Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.creatorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(event.creatorName)}`}
                alt={event.creatorName}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Organized By
                </p>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {event.creatorName}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {event.creatorEmail}
                </p>
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Organizer
              </span>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Sticky Action Box */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Participation Status
              </span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {hasJoined ? 'You Are Enrolled!' : 'Volunteer for this Drive'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {hasJoined 
                  ? 'Your attendance has been confirmed with the event organizer.' 
                  : 'Join fellow volunteers to make a meaningful difference.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{event.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{event.location}</span>
              </div>
            </div>

            {/* Join / Cancel Button */}
            {!hasJoined ? (
              <button
                onClick={handleJoinEvent}
                disabled={joining}
                className="btn-primary w-full py-3.5 text-base shadow-md cursor-pointer disabled:opacity-50"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>{joining ? 'Registering...' : 'Join Event'}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-center text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Enrolled as Volunteer</span>
                </div>
                <button
                  onClick={handleCancelParticipation}
                  className="w-full text-xs text-rose-600 hover:text-rose-700 font-semibold py-1.5 cursor-pointer text-center"
                >
                  Withdraw / Cancel Participation
                </button>
              </div>
            )}

            {!user && (
              <p className="text-[11px] text-center text-gray-400">
                * You will be prompted to log in to complete your registration.
              </p>
            )}

            {/* Share event */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Spread the Word
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Join me at "${event.title}" on CareWave! ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-black hover:text-white transition-colors"
                  title="Share on X"
                >
                  <XIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
