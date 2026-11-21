'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Image as ImageIcon, Save, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setSaving(true);
    await updateProfile(name.trim(), photoURL.trim());
    setSaving(false);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Volunteer Profile
          </div>
          <h1 className="section-heading">My Profile & Account</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View and update your display name and profile avatar across CareWave initiatives.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          
          {/* Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Volunteer')}`}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {name || 'Volunteer User'}
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active Community Member
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Display Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Email Address (Permanent Identifier)
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/40 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Profile Picture URL
              </label>
              <div className="relative">
                <ImageIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Dicebear SVG URL"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Paste any direct image URL or leave empty to use an avatar generated from your name.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-3 px-6 text-sm shadow-md cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </ProtectedRoute>
  );
}
