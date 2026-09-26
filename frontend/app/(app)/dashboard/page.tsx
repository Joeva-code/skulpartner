'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, fetchMe } from '@/lib/api';
import type { MeUser } from '@/lib/api';
import { getNextOnboardingStep, isOnboardingComplete } from '@/lib/use-onboarding-status';
import type { OnboardingStatus } from '@/lib/use-onboarding-status';
import { useContributions, formatNaira, getWalletBalance } from '@/lib/use-contributions';

export default function DashboardPage() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [error, setError] = useState('');
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const { summary, contributions, transactions, loading: moneyLoading } =
    useContributions();

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

  const hasContributions = (summary?.count ?? 0) > 0;
  const contributionBalance = getWalletBalance(summary?.wallets, 'CONTRIBUTION');
  const schoolBalance = getWalletBalance(summary?.wallets, 'SCHOOL');
  const totalWalletBalance = contributionBalance + schoolBalance;

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

      {/* Contributions card */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Your contributions</h2>
            <p className="mt-1 text-sm text-gray-500">
              {hasContributions
                ? `${summary?.count} plan${summary?.count === 1 ? '' : 's'} · ${formatNaira(
                    summary?.contributed,
                  )} contributed of ${formatNaira(summary?.contributionTarget)} target`
                : "Set up your school-fee contribution plan to start funding your child's education."}
            </p>
          </div>

          <Link
            href="/contribute"
            className="rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            {hasContributions ? 'Add contribution' : 'Set up contribution'}
          </Link>
        </div>

        {hasContributions && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Contribution progress</span>
              <span>{summary?.progressPct ?? 0}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-[#6d8f52] transition-all"
                style={{ width: `${Math.min(summary?.progressPct ?? 0, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Target {formatNaira(summary?.contributionTarget)}</span>
              <span>Paid {formatNaira(summary?.totalPaid)}</span>
            </div>
          </div>
        )}

        {!moneyLoading && !hasContributions && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-3xl">💼</p>
            <h3 className="mt-3 text-lg font-bold">No contributions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your target is 70% of your child&apos;s annual school fees. Add a
              beneficiary, then set up your first plan.
            </p>
            <Link
              href="/contribute"
              className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
            >
              Set up contribution
            </Link>
          </div>
        )}

        {hasContributions && (
          <ul className="mt-6 divide-y divide-gray-100">
            {contributions.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {c.beneficiaryName ?? 'Contribution plan'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cycle {c.currentCycleNumber} · {c.cycles.length} term
                    {c.cycles.length === 1 ? '' : 's'} · {c.status}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold">
                  {formatNaira(c.contributionAmount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Wallet card */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Your wallet</h2>
            <p className="mt-1 text-sm text-gray-500">
              Funds held by SKULPARTNERS and released term by term.
            </p>
          </div>

          <p className="text-2xl font-black tracking-tight">
            {formatNaira(totalWalletBalance)}
          </p>
        </div>

        {moneyLoading ? (
          <p className="mt-6 text-sm text-gray-500">Loading wallet…</p>
        ) : totalWalletBalance === 0 ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-3xl">👛</p>
            <h3 className="mt-3 text-lg font-bold">Wallet coming soon</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your wallet opens as soon as you make your first contribution.
            </p>
            <Link
              href="/contribute"
              className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
            >
              Make a contribution
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f1f7ed] p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#3f5a2e]">
                  Contribution wallet
                </p>
                <p className="mt-2 text-2xl font-black text-[#1c1c1c]">
                  {formatNaira(contributionBalance)}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  School-fee wallet
                </p>
                <p className="mt-2 text-2xl font-black text-[#1c1c1c]">
                  {formatNaira(schoolBalance)}
                </p>
              </div>
            </div>

            {transactions.length > 0 && (
              <ul className="mt-6 divide-y divide-gray-100">
                {transactions.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {t.description ?? t.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500">{t.reference}</p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-bold ${
                        Number(t.amount) < 0 ? 'text-red-600' : 'text-[#3f5a2e]'
                      }`}
                    >
                      {Number(t.amount) < 0 ? '-' : '+'}
                      {formatNaira(Math.abs(Number(t.amount)))}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/transactions"
              className="mt-4 inline-block text-sm font-semibold text-[#3f5a2e] hover:underline"
            >
              View all transactions →
            </Link>
          </>
        )}
      </div>
    </section>
  );
}