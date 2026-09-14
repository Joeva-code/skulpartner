'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (code.length !== 6) {
      setError('Enter the 6-digit reset code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post(
        '/auth/password/reset',
        { email, code, newPassword },
        { auth: false },
      );

      router.push('/login?reset=1');
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

      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          6-digit reset code
        </label>

        <input
          id="code"
          type="text"
          inputMode="numeric"
          required
          maxLength={6}
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, ''))
          }
          placeholder="Enter 6-digit code"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-bold tracking-[0.5em] outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          New password
        </label>

        <input
          id="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm new password
        </label>

        <input
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your new password"
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
        {loading ? 'Resetting password...' : 'Reset password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
            Reset password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter the code we sent and choose a new password.
          </p>
        </div>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn&apos;t get a code?{' '}
          <Link
            href="/forgot-password"
            className="font-semibold text-[#6d8f52] hover:underline"
          >
            Request a new one
          </Link>
        </p>
      </div>
    </main>
  );
}
