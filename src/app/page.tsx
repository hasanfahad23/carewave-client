'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CalendarClock, 
  Users2, 
  TrendingUp, 
  Layers, 
  Mail, 
  CheckCircle2, 
  MapPin, 
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../lib/api';
import { EventItem } from '../types';
import { EventCard } from '../components/EventCard';
import { EventGridSkeleton } from '../components/LoadingSkeleton';

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await apiRequest('/events/recent');
        if (res.success && res.data) {
          setRecentEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load recent events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchRecent();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setNewsletterSubmitted(true);
    toast.success('Thank you for subscribing to CareWave Community Updates!');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero / Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50/30 to-transparent dark:from-emerald-950/20 dark:via-gray-900 dark:to-transparent py-20 lg:py-28 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Community Grassroots Movement
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.12]">
                Mobilizing Hope, Empowering Local <span className="text-emerald-600 dark:text-emerald-400">Social Impact</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join thousands of compassionate changemakers taking action. Discover, organize, and participate in winter clothes drives, food relief missions, environmental cleanups, and free healthcare camps right in your neighborhood.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/events" className="btn-primary w-full sm:w-auto text-base py-3 px-6">
                  <span>Explore Upcoming Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link href="/create-event" className="btn-secondary w-full sm:w-auto text-base py-3 px-6">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Organize an Event</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 grid grid-cols-3 gap-4 text-center sm:text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">12,500+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Beneficiaries Served</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">450+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Volunteers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">100%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Community Driven</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteers distributing relief supplies"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-2.5 py-1 rounded bg-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                      Featured Mission
                    </span>
                    <h4 className="text-xl font-bold mt-2 leading-snug">
                      Winter Clothes & Blanket Relief Drive
                    </h4>
                    <p className="text-xs text-gray-200 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Mirpur 10 & Mohammadpur, Dhaka
                    </p>
                  </div>
                </div>

                {/* Floating mini stat card */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Verified Initiatives</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Active Across 8 Divisions</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Why Choose CareWave
          </span>
          <h2 className="section-heading">
            Built for Transparent Community Action
          </h2>
          <p className="section-subheading">
            Our platform bridges willing volunteers with credible grassroots campaigns, providing the tools needed to initiate, coordinate, and track tangible social progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all hover:shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Verified Organizers
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Every initiative records the creator credentials, contact details, and location coordinates to ensure volunteer safety and accountability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all hover:shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Future-Focused Scheduling
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Automated validation guarantees all listed events are upcoming, preventing outdated listings and maximizing volunteer turnout.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all hover:shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Instant Volunteer Roster
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Volunteers can join with a single click. Event organizers get a real-time list of confirmed attendees to plan logistics effectively.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all hover:shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Measurable Local Impact
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Track blanket allocations, trees planted, kilos of plastic collected, and meals distributed through open community metrics.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Recent Upcoming Events Section (Dynamic - limit(6)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Immediate Action Needed
            </span>
            <h2 className="section-heading">
              Recent Upcoming Events
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Browse the latest community-created initiatives scheduled in your area.
            </p>
          </div>
          
          <Link href="/events" className="btn-secondary self-start md:self-auto text-sm">
            <span>View All Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Events Grid */}
        {loadingEvents ? (
          <EventGridSkeleton count={6} />
        ) : recentEvents.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No Upcoming Events Right Now</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">Be the first to ignite change in your community!</p>
            <Link href="/create-event" className="btn-primary">
              Create an Event Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Gallery Section (Static showcase of community service events) */}
      <section className="bg-gray-100/60 dark:bg-gray-900/60 py-20 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Moments of Solidarity
            </span>
            <h2 className="section-heading">
              Community In Action Gallery
            </h2>
            <p className="section-subheading">
              Snapshots of volunteers, grassroots leaders, and neighbors uniting to bring warmth, sustenance, clean air, and education to those in need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="group relative rounded-2xl overflow-hidden shadow-md h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                alt="Volunteers packing food packages"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Food Support</span>
                <h4 className="text-lg font-bold">Nutritional Packages Distribution</h4>
                <p className="text-xs text-gray-300">Provided staple food kits to 350 low-income households.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden shadow-md h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                alt="Community planting young trees"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Environment</span>
                <h4 className="text-lg font-bold">1,000 Tree Plantation Drive</h4>
                <p className="text-xs text-gray-300">Restoring urban canopy in municipal parks.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden shadow-md h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
                alt="Volunteers cleaning riverbanks"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Civic Sanitation</span>
                <h4 className="text-lg font-bold">Buriganga River Cleanup Campaign</h4>
                <p className="text-xs text-gray-300">Extracted over 2.4 tons of single-use plastic waste.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden shadow-md h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
                alt="Children reading books with volunteers"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Education</span>
                <h4 className="text-lg font-bold">Street School & Book Distribution</h4>
                <p className="text-xs text-gray-300">Delivered storybooks and art supplies to young learners.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden shadow-md h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                alt="Medical checkup camp"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Healthcare</span>
                <h4 className="text-lg font-bold">Free Community Health Camp</h4>
                <p className="text-xs text-gray-300">Screening vitals and giving eye consultations for domestic workers.</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden shadow-md h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                alt="Winter clothes handover"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Winter Relief</span>
                <h4 className="text-lg font-bold">Sidewalk Blanket Handover</h4>
                <p className="text-xs text-gray-300">Distributing warm blankets to elderly citizens during cold waves.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Newsletter Section (Designed, no backend functionality required) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white mb-2 shadow-inner">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Stay Connected With Local Relief Drives
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Subscribe to our weekly digest to get notified whenever urgent community service, blood donation, or disaster relief drives are initiated in your city.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-emerald-200">
              Zero spam. Unsubscribe at any time with one click.
            </p>
          </div>

          {/* Background decorative circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/10 blur-2xl" />
        </div>
      </section>

    </div>
  );
}
