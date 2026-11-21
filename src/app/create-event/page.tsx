'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Calendar, MapPin, Image, Tag, FileText, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { EventType } from '../../types';

const EVENT_TYPES: EventType[] = [
  'Donation',
  'Plantation',
  'Cleanup',
  'Food Relief',
  'Healthcare',
  'Education',
  'Blood Donation',
  'Disaster Relief',
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('Donation');
  const [thumbnail, setThumbnail] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Compute today's date in YYYY-MM-DD format for HTML date input `min` attribute
  // Ensure that no past date can be chosen
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!title.trim() || !description.trim() || !location.trim() || !eventDate) {
      toast.error('Please fill out all required fields.');
      return;
    }

    // Ensure date is in the future
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      toast.error('Event date must be strictly in the future. Past dates are not permitted.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
          location: location.trim(),
          eventDate,
        }),
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Event Created Successfully!',
          text: 'Your social initiative has been published and is now accepting volunteers.',
          confirmButtonColor: '#059669',
        });
        // Success message and redirected to Upcoming Events page
        router.push('/events');
      } else {
        toast.error(res.message || 'Failed to create event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Organizer Portal
          </div>
          <h1 className="section-heading">
            Create a Social Service Event
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl">
            Mobilize community volunteers for winter warmth distributions, river cleanups, tree plantings, or educational workshops in your neighborhood.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Clothes Distribution – Mirpur 10"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Event Type & Event Date in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Event Type (Category) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Event Date (Must be future) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    required
                    min={minDateString}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  * Only future dates can be selected.
                </p>
              </div>

            </div>

            {/* Location & Image URL in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mirpur 10 Roundabout, Dhaka"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Thumbnail Image URL
                </label>
                <div className="relative">
                  <Image className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Leave empty to automatically assign a high-res cover image.
                </p>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Event Description & Volunteer Brief <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the objectives, what volunteers should bring, meeting points, and target community beneficiaries..."
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Creator Attribution Info */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              <p>
                <strong>Organizer Attribution:</strong> This event will be published under your authenticated account: <strong>{user?.name}</strong> ({user?.email}).
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full sm:w-auto py-3.5 px-8 text-base shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Publishing Event...' : 'Publish Event'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </ProtectedRoute>
  );
}
