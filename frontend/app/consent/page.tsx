'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/use-session';
import WizardCard from '@/components/WizardCard';

export default function ConsentPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleAccept() {
    setSaving(true);
    setError('');

    try {
      await api.post('/consent', {
        termsVersion: '1.0',
        privacyVersion: '1.0',
      });
      router.push('/welcome');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to record consent',
      );
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <WizardCard
      step={5}
      title="Terms & consent"
      subtitle="Please review and accept before we create your account."
    >
      <div className="space-y-4">
        <div className="space-y-3 rounded-2xl border border-gray-200 p-4 text-sm text-gray-600">
          <p>
            <strong>Terms of Service:</strong> By creating an account you agree
            to use SKULPARTNERS to make education contributions toward school
            fees and to the contribution terms shown during onboarding.
          </p>

          <p>
            <strong>NDPR / Privacy:</strong> We collect and process your
            personal data in line with the Nigeria Data Protection Regulation.
            We will never sell your data.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            className="mt-0.5 h-5 w-5 accent-[#6d8f52]"
          />

          <span className="text-sm text-gray-600">
            I have read and agree to the Terms &amp; Conditions and the Privacy
            Policy, and I consent to the processing of my personal data under
            NDPR.
          </span>
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleAccept}
          disabled={!checked || saving}
          className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Accept & continue'}
        </button>
      </div>
    </WizardCard>
  );
}