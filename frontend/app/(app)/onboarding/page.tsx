'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { getNextOnboardingStep } from '@/lib/use-onboarding-status';
import type { OnboardingStatus } from '@/lib/use-onboarding-status';

// Single entry point for the dashboard "Onboarding" tab/button.
// This page lives inside the authenticated (app) layout, so it can only
// be displayed/used after register + sign-in.
export default function OnboardingEntryPage() {
  const router = useRouter();

  useEffect(() => {
    api
      .get<OnboardingStatus>('/onboarding/status')
      .then((status) => {
        router.replace(getNextOnboardingStep(status).href);
      })
      .catch(() => {
        router.replace('/verify');
      });
  }, [router]);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
        Finding where you left off…
      </div>
    </section>
  );
}
