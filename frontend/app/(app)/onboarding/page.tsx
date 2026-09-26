'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getNextOnboardingStep } from '@/lib/use-onboarding-status';
import type { OnboardingStatus } from '@/lib/use-onboarding-status';

// Single entry point for the dashboard "Onboarding" tab.
// This page lives inside the authenticated (app) layout, so it can only
// be displayed/used after register + sign-in.
//
// If onboarding is incomplete we forward to the next unfinished step.
// If it is already complete we render a summary here rather than
// bouncing the user back to the dashboard, so the tab always does
// something visible.
export default function OnboardingEntryPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    api
      .get<OnboardingStatus>('/onboarding/status')
      .then((status) => {
        const next = getNextOnboardingStep(status);

        if (next.key === 'done') {
          setDone(true);
          return;
        }

        router.replace(next.href);
      })
      .catch(() => {
        router.replace('/verify');
      });
  }, [router]);

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      {!done ? (
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Finding where you left off…
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3f5a2e]">
            Onboarding complete
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#1c1c1c]">
            You&apos;re all set ✓
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your contact details, KYC, beneficiary, next of kin and consent are
            all on file. Manage them any time from your profile.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
            >
              View profile
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to home
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

