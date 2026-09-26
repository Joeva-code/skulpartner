'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatNaira, useContributionQuote } from '@/lib/use-contributions';

type Beneficiary = {
  id: string;
  firstName: string;
  lastName: string;
  grade: string | null;
  annualFee: string | number;
  school: { id: string; name: string } | null;
};

const PAYMENT_METHODS = [
  { value: 'TRANSFER', label: 'Bank transfer' },
  { value: 'CARD', label: 'Debit / credit card' },
  { value: 'USSD', label: 'USSD' },
] as const;

export default function ContributePage() {
  const router = useRouter();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selected, setSelected] = useState('');
  const [method, setMethod] = useState<'TRANSFER' | 'CARD' | 'USSD'>(
    'TRANSFER',
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Beneficiary[]>('/beneficiaries')
      .then((list) => {
        setBeneficiaries(list);
        // Default to the first child so the page is useful immediately.
        if (list.length > 0) setSelected(list[0].id);
      })
      .catch(() => setError('Could not load your beneficiaries'))
      .finally(() => setLoading(false));
  }, []);

  const {
    quote,
    loading: quoting,
    error: quoteError,
  } = useContributionQuote(selected);

  async function handleSubmit() {
    if (!selected || !quote) return;
    setSubmitting(true);
    setError('');

    try {
      await api.post('/contributions', {
        beneficiaryId: selected,
        paymentMethod: method,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Contribution failed. Try again.',
      );
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Loading…
        </div>
      </section>
    );
  }

  if (beneficiaries.length === 0) {
    return (
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-3xl">🧒</p>
          <h1 className="mt-3 text-lg font-bold">Add your child first</h1>
          <p className="mt-1 text-sm text-gray-500">
            You need a beneficiary on file before you can contribute toward
            school fees.
          </p>
          <Link
            href="/beneficiary"
            className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            Add a beneficiary
          </Link>
        </div>
      </section>
    );
  }


  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">Make a contribution</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pay once today and we release the school fees each term.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <label
          htmlFor="contribute-beneficiary"
          className="mb-2 block text-sm font-semibold"
        >
          Who is this for?
        </label>
        <select
          id="contribute-beneficiary"
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20"
        >
          {beneficiaries.map((b) => (
            <option key={b.id} value={b.id}>
              {b.firstName} {b.lastName}
              {b.school ? ` — ${b.school.name}` : ''}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">How would you like to pay?</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  method === m.value
                    ? 'border-[#6d8f52] bg-[#f1f7ed] text-[#3f5a2e]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {quoting ? (
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Pricing this contribution…
        </div>
      ) : quote ? (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold">What you will pay</h2>
          <p className="mt-1 text-sm text-gray-500">
            Contribute {formatNaira(quote.contributionAmount)} today —{' '}
            {Math.round(quote.contributionRate * 100)}% of {formatNaira(quote.annualFees)}{' '}
            in annual school fees — and we release{' '}
            {formatNaira(quote.termFeeTarget)} per term across {quote.termCount} terms.
          </p>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Annual school fees</dt>
              <dd className="font-semibold">{formatNaira(quote.annualFees)}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-gray-600">
                Contribution target ({Math.round(quote.contributionRate * 100)}%)
              </dt>
              <dd className="font-semibold">
                {formatNaira(quote.contributionAmount)}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-gray-600">
                Insurance fee ({quote.insuranceRate}%)
              </dt>
              <dd className="font-semibold">{formatNaira(quote.insuranceFee)}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Maintenance fee</dt>
              <dd className="font-semibold">{formatNaira(quote.maintenanceFee)}</dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base">
              <dt className="font-bold">Total upfront</dt>
              <dd className="font-black">{formatNaira(quote.totalUpfront)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Processing…'
              : `Contribute ${formatNaira(quote.totalUpfront)}`}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Always contribute only what you can afford.
          </p>
        </div>
      ) : quoteError ? (
        <div className="rounded-3xl bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-700">
            Could not price this contribution
          </p>
          <p className="mt-1 text-sm text-red-600">{quoteError}</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Select a beneficiary to see your contribution breakdown.
        </div>
      )}
    </section>
  );
}

