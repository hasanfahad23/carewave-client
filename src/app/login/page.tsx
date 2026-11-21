'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowRight, HeartHandshake, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/events';
  const { login, googleLogin, handleGoogleCredential } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    const success = await login(email.trim(), password);
    setSubmitting(false);

    if (success) {
      router.push(redirectPath);
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await googleLogin();
    if (success) {
      router.push(redirectPath);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 mb-2">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Sign in to access your volunteer roster and organize relief initiatives.
        </p>
      </div>

      {/* Real Google Login */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex justify-center py-1">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                const ok = await handleGoogleCredential(credentialResponse.credential);
                if (ok) router.push(redirectPath);
              }
            }}
            onError={() => {
              toast.error('Google Sign In was cancelled or failed.');
            }}
            theme="outline"
            size="large"
            shape="pill"
            text="continue_with"
            width="320"
          />
        </div>

        <div className="relative my-4 w-full text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <span className="relative bg-white dark:bg-gray-900 px-3 text-xs uppercase tracking-wider text-gray-400">
            Or sign in with email
          </span>
        </div>
      </div>

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 text-sm font-bold shadow-md cursor-pointer disabled:opacity-50 mt-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
        </button>

      </form>

      {/* Link to Register Page */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Create account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
