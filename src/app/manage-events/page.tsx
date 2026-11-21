'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  PlusCircle, 
  X, 
  Eye, 
  ExternalLink,
  Tag,
  FileText,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { EventItem, EventType } from '../../types';
import { TableSkeleton } from '../../components/LoadingSkeleton';

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

export default function ManageEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editEventType, setEditEventType] = useState<EventType>('Donation');
  const [editLocation, setEditLocation] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [updating, setUpdating] = useState(false);

  // Volunteers Drawer State
  const [viewingVolunteersEvent, setViewingVolunteersEvent] = useState<EventItem | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/events/user/created');
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load user events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const handleOpenEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditEventType(event.eventType);
    setEditLocation(event.location);
    setEditThumbnail(event.thumbnail);
    setEditEventDate(event.eventDate ? event.eventDate.split('T')[0] : '');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!editTitle.trim() || !editDescription.trim() || !editLocation.trim() || !editEventDate) {
      toast.error('All fields are required.');
      return;
    }

    const selectedDate = new Date(editEventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      toast.error('Event date must be in the future. Past dates cannot be added.');
      return;
    }

    setUpdating(true);
    try {
      const res = await apiRequest(`/events/${editingEvent._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          eventType: editEventType,
          location: editLocation.trim(),
          thumbnail: editThumbnail.trim() || editingEvent.thumbnail,
          eventDate: editEventDate,
        }),
      });

      if (res.success) {
        toast.success(res.message || 'Event updated successfully!');
        setEditingEvent(null);
        fetchMyEvents();
      } else {
        toast.error(res.message || 'Failed to update event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Delete this event?',
      text: `Are you sure you want to delete "${eventTitle}"? This action is permanent.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiRequest(`/events/${eventId}`, {
        method: 'DELETE',
      });

      if (res.success) {
        toast.success(res.message || 'Event deleted successfully.');
        setEvents((prev) => prev.filter((item) => item._id !== eventId));
      } else {
        toast.error(res.message || 'Failed to delete event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting event.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Creator Management Hub
            </div>
            <h1 className="section-heading">Manage Your Events</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Review, modify details, monitor volunteer registrations, or remove initiatives created under your account.
            </p>
          </div>

          <Link href="/create-event" className="btn-primary self-start sm:self-auto text-sm shrink-0">
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Content Table */}
        {loading ? (
          <TableSkeleton rows={5} />
        ) : events.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl space-y-4">
            <AlertCircle className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              No Events Created Yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              You haven&apos;t published any social development initiatives yet. Start by creating a community drive!
            </p>
            <div className="pt-2">
              <Link href="/create-event" className="btn-primary text-sm">
                Create Your First Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-4">Event</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Date</th>
                    <th scope="col" className="px-6 py-4">Location</th>
                    <th scope="col" className="px-6 py-4">Volunteers</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {events.map((event) => {
                    const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={event._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                        
                        {/* Event Thumbnail & Title */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={event.thumbnail}
                              alt={event.title}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-bold text-gray-900 dark:text-white truncate">
                                {event.title}
                              </p>
                              <Link
                                href={`/events/${event._id}`}
                                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <span>Public Page</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {event.eventType}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            {event.location}
                          </span>
                        </td>

                        {/* Volunteers */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setViewingVolunteersEvent(event)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Click to view volunteer names"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{event.participantCount || 0} enrolled</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(event)}
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                              title="Update Event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteEvent(event._id, event.title)}
                              className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Update Event Details
                  </h3>
                  <p className="text-xs text-gray-500">Edit details for: {editingEvent.title}</p>
                </div>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Event Category *
                    </label>
                    <select
                      value={editEventType}
                      onChange={(e) => setEditEventType(e.target.value as EventType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Date (Must be future) *
                    </label>
                    <input
                      type="date"
                      required
                      min={minDateString}
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-primary text-xs"
                  >
                    {updating ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Viewing Volunteers Modal */}
        {viewingVolunteersEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Confirmed Volunteers
                  </h3>
                </div>
                <button
                  onClick={() => setViewingVolunteersEvent(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Initiative: <strong>{viewingVolunteersEvent.title}</strong>
              </p>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {viewingVolunteersEvent.volunteers && viewingVolunteersEvent.volunteers.length > 0 ? (
                  viewingVolunteersEvent.volunteers.map((vol, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{vol.name}</p>
                        <p className="text-xs text-gray-500">{vol.email}</p>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(vol.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-6 text-center">
                    No individual user accounts recorded yet for this event.
                  </p>
                )}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setViewingVolunteersEvent(null)}
                  className="btn-secondary text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
