import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export type Wallet = {
  type: 'CONTRIBUTION' | 'SCHOOL';
  balance: number;
  updatedAt: string;
};

export type ContributionsSummary = {
  count: number;
  activeCount: number;
  annualFees: number;
  contributionTarget: number;
  contributed: number;
  feesPaid: number;
  totalPaid: number;
  schoolFeesCovered: number;
  progressPct: number;
  wallets: Wallet[];
};

export type ContributionCycle = {
  id: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  days: number;
  termFeeTarget: number;
  amountAchieved: number | null;
  growthEarned: number | null;
  netBalance: number | null;
  status: string;
};

export type Contribution = {
  id: string;
  status: string;
  annualFees: number;
  contributionAmount: number;
  insuranceFee: number;
  maintenanceFee: number;
  totalUpfront: number;
  currentCycleNumber: number;
  createdAt: string;
  updatedAt: string;
  cycles: ContributionCycle[];
  beneficiaryId?: string;
  beneficiaryName?: string;
  paymentMethod?: string;
};

export type WalletTransaction = {
  id: string;
  walletType: string | null;
  type: string;
  amount: number;
  reference: string;
  status: string;
  description: string | null;
  createdAt: string;
};

export type ContributionsConfig = {
  contributionRate: number;
  insuranceRate: number;
  termCount: number;
  maintenanceFee: number;
  cycles: { cycleNumber: number; days: number }[];
};

export type ContributionQuote = {
  beneficiaryId: string;
  beneficiaryName: string;
  annualFees: number;
  contributionAmount: number;
  insuranceFee: number;
  maintenanceFee: number;
  totalUpfront: number;
  contributionRate: number;
  insuranceRate: number;
  termFeeTarget: number;
  termCount: number;
};

/** Naira formatting used across the dashboard and contribute flow. */
export function formatNaira(value: number | null | undefined): string {
  return `₦${(Number(value ?? 0)).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * The three dashboard reads. allSettled so a single failing endpoint never
 * blanks the whole page.
 */
function fetchAll() {
  return Promise.allSettled([
    api.get<ContributionsSummary>('/contributions/summary'),
    api.get<Contribution[]>('/contributions?limit=20'),
    api.get<WalletTransaction[]>('/wallet/transactions?limit=20'),
  ]);
}

type FetchAllResult = Awaited<ReturnType<typeof fetchAll>>;

function applyResults(
  [summaryResult, listResult, txResult]: FetchAllResult,
  setSummary: (value: ContributionsSummary) => void,
  setContributions: (value: Contribution[]) => void,
  setTransactions: (value: WalletTransaction[]) => void,
  setError: (value: string) => void,
) {
  if (summaryResult.status === 'fulfilled') {
    setSummary(summaryResult.value);
  } else {
    setError(
      summaryResult.reason instanceof Error
        ? summaryResult.reason.message
        : 'Failed to load your contributions',
    );
  }

  if (listResult.status === 'fulfilled') {
    setContributions(listResult.value);
  }

  if (txResult.status === 'fulfilled') {
    setTransactions(txResult.value);
  }
}

export function useContributions() {
  const [summary, setSummary] = useState<ContributionsSummary | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Manual refresh (retry button, post-mutation reload).
  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await fetchAll();
    applyResults(
      results,
      setSummary,
      setContributions,
      setTransactions,
      setError,
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    // State is only committed inside the promise callbacks, so the effect
    // body never calls setState synchronously (no cascading render).
    let cancelled = false;

    fetchAll()
      .then((results) => {
        if (cancelled) return;
        applyResults(
          results,
          setSummary,
          setContributions,
          setTransactions,
          setError,
        );
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load your contributions');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { summary, contributions, transactions, loading, error, reload };
}

export function getWalletBalance(
  wallets: Wallet[] | undefined,
  type: Wallet['type'],
): number {
  return wallets?.find((w) => w.type === type)?.balance ?? 0;
}

/**
 * Live pricing for a single beneficiary.
 *
 * All state is committed inside promise callbacks, and `loading`/`error` are
 * derived from the id the result belongs to — so switching beneficiaries never
 * calls setState synchronously in the effect body (no cascading render).
 */
export function useContributionQuote(beneficiaryId: string) {
  const [result, setResult] = useState<{
    id: string;
    quote: ContributionQuote | null;
    error: string;
  } | null>(null);

  useEffect(() => {
    if (!beneficiaryId) return;

    let cancelled = false;

    api
      .get<ContributionQuote>(`/contributions/quote/${beneficiaryId}`)
      .then((quote) => {
        if (!cancelled) setResult({ id: beneficiaryId, quote, error: '' });
      })
      .catch((err) => {
        if (cancelled) return;
        setResult({
          id: beneficiaryId,
          quote: null,
          error:
            err instanceof Error
              ? err.message
              : 'Could not price this contribution',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [beneficiaryId]);

  return {
    quote: result?.id === beneficiaryId ? result.quote : null,
    loading: Boolean(beneficiaryId) && result?.id !== beneficiaryId,
    error: result?.id === beneficiaryId ? result.error : '',
  };
}
