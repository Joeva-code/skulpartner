'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/use-session';
import WizardCard from '@/components/WizardCard';

type OnboardingStatus = {
  emailVerified: boolean;
  phoneVerified: boolean;
  phone: string | null;
};

type OtpState = {
  mode: 'idle' | 'sent' | 'verifying';
  code: string;
  devCode: string | null;
  error: string;
};

const initialOtp: OtpState = {
  mode: 'idle',
  code: '',
  devCode: null,
  error: '',
};

function VerifiedBadge() {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
      ✓ Verified
    </span>
  );
}

function OtpFlow({
  state,
  onRequest,
  onVerify,
  setCode,
}: {
  state: OtpState;
  onRequest: () => void;
  onVerify: () => void;
  setCode: (value: string) => void;
}) {
  if (state.mode === 'idle') {
    return (
      <button
        onClick={onRequest}
        className="mt-3 w-full rounded-xl bg-[#6d8f52] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d7e45]"
      >
        Send code
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {state.devCode && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Dev code:{' '}
          <span className="font-bold tracking-widest">{state.devCode}</span>
        </p>
      )}

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={state.code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
        placeholder="Enter 6-digit code"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-bold tracking-[0.5em] outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
      />

      {state.error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onRequest}
          disabled={state.mode === 'verifying'}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Resend
        </button>

        <button
          onClick={onVerify}
          disabled={state.code.length !== 6 || state.mode === 'verifying'}
          className="flex-1 rounded-xl bg-[#1c1c1c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.mode === 'verifying' ? 'Verifying…' : 'Verify'}
        </button>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [emailOtp, setEmailOtp] = useState<OtpState>(initialOtp);
  const [phoneOtp, setPhoneOtp] = useState<OtpState>(initialOtp);

  async function refreshStatus() {
    const s = await api.get<OnboardingStatus>('/onboarding/status');
    setStatus(s);
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api
      .get<OnboardingStatus>('/onboarding/status')
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function requestOtp(channel: 'EMAIL' | 'PHONE') {
    const setter = channel === 'EMAIL' ? setEmailOtp : setPhoneOtp;
    setter({ ...initialOtp, mode: 'sent' });

    try {
      const res = await api.post<{ message: string; devCode: string }>(
        '/auth/otp/request',
        { channel },
      );
      setter({ mode: 'sent', code: '', devCode: res.devCode, error: '' });
    } catch (err) {
      setter({
        ...initialOtp,
        error: err instanceof Error ? err.message : 'Failed to send code',
      });
    }
  }

  async function verifyOtp(channel: 'EMAIL' | 'PHONE') {
    const current = channel === 'EMAIL' ? emailOtp : phoneOtp;
    const setter = channel === 'EMAIL' ? setEmailOtp : setPhoneOtp;
    setter({ ...current, mode: 'verifying' });

    try {
      await api.post('/auth/otp/verify', { channel, code: current.code });
      setter(initialOtp);
      await refreshStatus();
    } catch (err) {
      setter({
        ...current,
        mode: 'sent',
        error: err instanceof Error ? err.message : 'Verification failed',
      });
    }
  }

  if (loading || !user || !status) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  const emailDone = status.emailVerified;
  const phoneDone = !status.phone || status.phoneVerified;
  const allDone = emailDone && phoneDone;

  return (
    <WizardCard
      step={1}
      title="Verify your contact details"
      subtitle="Confirm your email and phone to secure your account."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Email address</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            {emailDone && <VerifiedBadge />}
          </div>

          {!emailDone && (
            <OtpFlow
              state={emailOtp}
              onRequest={() => requestOtp('EMAIL')}
              onVerify={() => verifyOtp('EMAIL')}
              setCode={(v) => setEmailOtp((s) => ({ ...s, code: v }))}
            />
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Phone number</p>
              <p className="text-xs text-gray-500">
                {user.phone ?? 'No phone number on file'}
              </p>
            </div>
            {phoneDone && <VerifiedBadge />}
          </div>

          {user.phone && !phoneDone && (
            <OtpFlow
              state={phoneOtp}
              onRequest={() => requestOtp('PHONE')}
              onVerify={() => verifyOtp('PHONE')}
              setCode={(v) => setPhoneOtp((s) => ({ ...s, code: v }))}
            />
          )}
        </div>

        {allDone ? (
          <button
            onClick={() => router.push('/kyc')}
            className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333]"
          >
            Continue to KYC →
          </button>
        ) : (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            Complete verification to continue.
          </p>
        )}
      </div>
    </WizardCard>
  );
}