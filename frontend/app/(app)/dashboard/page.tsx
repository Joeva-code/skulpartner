'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, fetchMe } from '@/lib/api';
import type { MeUser } from '@/lib/api';
import { getNextOnboardingStep, isOnboardingComplete } from '@/lib/use-onboarding-status';
import type { OnboardingStatus } from '@/lib/use-onboarding-status';

export default function DashboardPage() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [error, setError] = useState('');
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);

  useEffect(() => {
    fetchMe()
      .then((me) => {
        setUser(me);
        api
          .get<OnboardingStatus>('/onboarding/status')
          .then(setOnboarding)
          .catch(() => undefined);
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : 'Failed to load your account',
        ),
      );
  }, []);

  if (error) {
    return (
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Loading…
        </div>
      </section>
    );
  }

  const active = user.status === 'ACTIVE';
  const complete = isOnboardingComplete(onboarding);
  const next = getNextOnboardingStep(onboarding);

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      {!complete && (
        <div className="rounded-3xl border border-[#6d8f52]/30 bg-[#f1f7ed] p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3f5a2e]">
            Onboarding • Continue where you left off
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-[#1c1c1c]">
            Finish setting up your account
          </h2>
          <p className="mt-1 text-sm text-[#3f5a2e]">
            Verify your contact, complete KYC, add your child, next of kin and
            consent — in that order.
          </p>
          <Link
            href="/onboarding"
            className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            Continue onboarding → {next.label}
          </Link>
        </div>
      )}

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">Welcome back,</p>

        <h1 className="mt-2 text-3xl font-bold">
          {user.firstName} {user.lastName}
        </h1>

        <p className="mt-3 text-gray-600">{user.email}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f1f7ed] px-3 py-1 text-xs font-semibold text-[#3f5a2e]">
            Role: {user.role}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {user.status}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              user.emailVerified
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {user.emailVerified ? 'Email verified' : 'Email not verified'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-3xl">💼</p>

          <h2 className="mt-3 text-lg font-bold">No contributions yet</h2>

          <p className="mt-1 text-sm text-gray-500">
            Set up your school-fee contribution plan to start funding your
            child&apos;s education.
          </p>

          <a
            href="#"
            className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white"
          >
            Set up contribution (coming soon)
          </a>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-3xl">👛</p>

          <h2 className="mt-3 text-lg font-bold">Wallet coming soon</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your contribution and school-fee wallets will appear here.
          </p>
        </div>
      </div>
    </section>
  );
}