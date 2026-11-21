'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            404 Error
          </p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            The social service campaign or page you requested could not be located. It might have moved or is no longer accessible.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/" className="btn-primary text-sm">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link href="/events" className="btn-secondary text-sm">
            <span>Browse Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
