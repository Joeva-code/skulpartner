'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type LoginUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const data = await api.post<{
        message: string;
        accessToken: string;
        user: LoginUser;
      }>('/auth/login', { identifier, password }, { auth: false });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // After sign-in, always land on the dashboard first.
      // The dashboard owns the only Onboarding tab/button, so a user
      // can only discover/navigate onboarding after register + sign-in.
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-5">
      <div>
        <label
          htmlFor="auth-identifier"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email address or User ID
        </label>

        <input
          id="auth-identifier"
          type="text"
          required
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="you@example.com or your User ID"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="auth-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#6d8f52] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <input
          id="auth-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
        New here? Your User ID is issued on the welcome screen after you
        finish onboarding.
      </p>
    </form>
  );
}

