'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatNaira, useContributions } from '@/lib/use-contributions';
import type { WalletTransaction } from '@/lib/use-contributions';

const TX_TYPE_STYLES: Record<string, { label: string; className: string }> = {
  CONTRIBUTION: { label: 'Contribution', className: 'bg-green-100 text-green-800' },
  INSURANCE: { label: 'Insurance', className: 'bg-amber-100 text-amber-800' },
  MAINTENANCE: { label: 'Maintenance', className: 'bg-amber-100 text-amber-800' },
  SCHOOL_FEE: { label: 'School fee', className: 'bg-blue-100 text-blue-800' },
  GROWTH: { label: 'Growth', className: 'bg-purple-100 text-purple-800' },
  WITHDRAWAL: { label: 'Withdrawal', className: 'bg-gray-100 text-gray-700' },
};

const CREDIT_TYPES = ['CONTRIBUTION', 'GROWTH'];

function txStyle(type: string) {
  return TX_TYPE_STYLES[type] ?? {
    label: type.replace(/_/g, ' '),
    className: 'bg-gray-100 text-gray-700',
  };
}

function isCredit(type: string) {
  return CREDIT_TYPES.includes(type);
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const style = txStyle(tx.type);
  const credit = isCredit(tx.type);

  return (
    <tr className="border-t border-gray-100">
      <td className="py-3 pr-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
        >
          {style.label}
        </span>
      </td>

      <td className="py-3 pr-3 text-sm text-gray-700">
        <p className="font-medium text-gray-900">
          {tx.description ?? style.label}
        </p>

        <p className="text-xs text-gray-400">{tx.reference}</p>
      </td>

      <td className="py-3 pr-3 text-xs text-gray-500">
        {tx.walletType ?? '—'}
      </td>

      <td className="py-3 pr-3 text-xs text-gray-500">
        {formatDateTime(tx.createdAt)}
      </td>

      <td
        className={`py-3 text-right text-sm font-bold ${
          credit ? 'text-green-700' : 'text-gray-900'
        }`}
      >
        {credit ? '+' : '−'}
        {formatNaira(tx.amount)}
      </td>

      <td className="py-3 text-right text-xs text-gray-500">
        {tx.status.replace(/_/g, ' ')}
      </td>
    </tr>
  );
}

export default function TransactionsPage() {
  const { transactions, summary, loading, error, reload } = useContributions();
  const [filter, setFilter] = useState('ALL');

  const availableTypes = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.type))),
    [transactions],
  );

  const visible = useMemo(
    () =>
      filter === 'ALL'
        ? transactions
        : transactions.filter((t) => t.type === filter),
    [transactions, filter],
  );

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-black">Transactions</h1>

        <p className="mt-1 text-sm text-gray-500">
          Contributions, fees, insurance and school-fee releases, newest first.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          {error}

          <button
            onClick={reload}
            className="ml-3 font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Loading your transactions…
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-3xl">🧾</p>

          <h2 className="mt-3 text-lg font-bold">No transactions yet</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your first contribution will appear here, along with every fee and
            school-fee payment.
          </p>

          <Link
            href="/contribute"
            className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white"
          >
            Make a contribution
          </Link>
        </div>
      ) : (
        <>
          {summary && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Total paid
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#1c1c1c]">
                  {formatNaira(summary.totalPaid)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Fees released
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#1c1c1c]">
                  {formatNaira(summary.feesPaid)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Entries
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#1c1c1c]">
                  {transactions.length}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {['ALL', ...availableTypes].map((type) => {
              const active = filter === type;

              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                    active
                      ? 'bg-[#1c1c1c] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type.replace(/_/g, ' ').toLowerCase()}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto rounded-3xl bg-white p-5 shadow-sm">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  <th className="pb-3 pr-3">Type</th>
                  <th className="pb-3 pr-3">Description</th>
                  <th className="pb-3 pr-3">Wallet</th>
                  <th className="pb-3 pr-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

