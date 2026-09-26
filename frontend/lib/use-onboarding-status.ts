import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export type OnboardingStatus = {
  emailVerified: boolean;
  phoneVerified: boolean;
  phone: string | null;
  kyc: { id: string; status: string; submittedAt: string | null } | null;
  beneficiaryCount: number;
  hasNextOfKin: boolean;
  hasConsent: boolean;
};

export type OnboardingStepKey =
  | 'verify'
  | 'kyc'
  | 'beneficiary'
  | 'next-of-kin'
  | 'consent'
  | 'done';

export function getNextOnboardingStep(status: OnboardingStatus | null): {
  key: OnboardingStepKey;
  href: string;
  label: string;
} {
  if (!status) {
    return { key: 'verify', href: '/verify', label: 'Verify your contact' };
  }
  const phoneDone = !status.phone || status.phoneVerified;
  if (!status.emailVerified || !phoneDone) {
    return { key: 'verify', href: '/verify', label: 'Verify your contact' };
  }
  if (!status.kyc) {
    return { key: 'kyc', href: '/kyc', label: 'Complete KYC' };
  }
  if (status.beneficiaryCount === 0) {
    return { key: 'beneficiary', href: '/beneficiary', label: 'Add beneficiary' };
  }
  if (!status.hasNextOfKin) {
    return { key: 'next-of-kin', href: '/next-of-kin', label: 'Add next of kin' };
  }
  if (!status.hasConsent) {
    return { key: 'consent', href: '/consent', label: 'Accept consent' };
  }
  return { key: 'done', href: '/dashboard', label: 'Onboarding complete' };
}

export function isOnboardingComplete(status: OnboardingStatus | null): boolean {
  if (!status) return false;
  return getNextOnboardingStep(status).key === 'done';
}

export function useOnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<OnboardingStatus>('/onboarding/status')
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const next = getNextOnboardingStep(status);
  const complete = isOnboardingComplete(status);

  return { status, loading, next, complete, refresh: async () => {
    setLoading(true);
    try {
      const s = await api.get<OnboardingStatus>('/onboarding/status');
      setStatus(s);
    } finally {
      setLoading(false);
    }
  } };
}
