'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setMessage('');
    setDevCode(null);
    setLoading(true);

    try {
      const data = await api.post<{
        message: string;
        devCode: string | null;
      }>(
        '/auth/password/forgot',
        { email },
        { auth: false },
      );

      setMessage(data.message);
      setDevCode(data.devCode);
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
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center">
            <img
              src="/images/skulpartner_logo.svg"
              alt="SKULPARTNERS logo"
              className="h-14 w-auto"
            />
          </Link>

          <h1 className="mt-8 text-3xl font-bold text-[#1c1c1c]">
            Forgot password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your account email and we will send you a 6-digit reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {devCode && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Dev code:{' '}
              <span className="font-bold tracking-widest">{devCode}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending code...' : 'Send reset code'}
          </button>
        </form>

        {message && (
          <button
            onClick={() =>
              router.push(`/reset-password?email=${encodeURIComponent(email)}`)
            }
            className="mt-4 w-full rounded-xl bg-[#6d8f52] px-4 py-3 font-semibold text-white transition hover:bg-[#5d7e45]"
          >
            Continue to reset password →
          </button>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#6d8f52] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
