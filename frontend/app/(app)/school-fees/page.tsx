'use client';

import Link from 'next/link';
import { formatNaira, useContributions } from '@/lib/use-contributions';
import type { Contribution, ContributionCycle } from '@/lib/use-contributions';

const CYCLE_STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  UPCOMING: 'bg-blue-100 text-blue-800',
  RELEASED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  PAID: 'bg-green-100 text-green-800',
};

const CONTRIBUTION_STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function badge(map: Record<string, string>, status: string) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        map[status] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function optionalNaira(value: number | null): string {
  return value === null ? '—' : formatNaira(value);
}

function CycleRow({ cycle }: { cycle: ContributionCycle }) {
  const progress =
    cycle.termFeeTarget > 0
      ? Math.min(
          Math.round(((cycle.amountAchieved ?? 0) / cycle.termFeeTarget) * 100),
          100,
        )
      : 0;

  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Term {cycle.cycleNumber}</p>
          <p className="text-xs text-gray-500">
            {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)} ·{' '}
            {cycle.days} days
          </p>
        </div>

        {badge(CYCLE_STATUS_STYLES, cycle.status)}
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-[#6d8f52]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
        <span>
          Target{' '}
          <strong className="text-gray-900">
            {formatNaira(cycle.termFeeTarget)}
          </strong>
        </span>

        <span>
          Achieved{' '}
          <strong className="text-gray-900">
            {optionalNaira(cycle.amountAchieved)}
          </strong>
        </span>

        <span>
          Growth{' '}
          <strong className="text-gray-900">
            {optionalNaira(cycle.growthEarned)}
          </strong>
        </span>
      </div>
    </div>
  );
}

function ContributionCard({ contribution }: { contribution: Contribution }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {contribution.beneficiaryName ?? 'School-fee plan'}
          </p>

          <p className="text-xs text-gray-500">
            Started {formatDate(contribution.createdAt)} ·{' '}
            {contribution.currentCycleNumber} of{' '}
            {contribution.cycles.length || '—'} terms
          </p>
        </div>

        {badge(CONTRIBUTION_STATUS_STYLES, contribution.status)}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-gray-500">Annual fees</dt>
          <dd className="font-semibold text-gray-900">
            {formatNaira(contribution.annualFees)}
          </dd>
        </div>

        <div>
          <dt className="text-gray-500">Contribution</dt>
          <dd className="font-semibold text-gray-900">
            {formatNaira(contribution.contributionAmount)}
          </dd>
        </div>

        <div>
          <dt className="text-gray-500">Insurance</dt>
          <dd className="font-semibold text-gray-900">
            {formatNaira(contribution.insuranceFee)}
          </dd>
        </div>

        <div>
          <dt className="text-gray-500">Paid upfront</dt>
          <dd className="font-semibold text-gray-900">
            {formatNaira(contribution.totalUpfront)}
          </dd>
        </div>
      </dl>

      {contribution.cycles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Term schedule
          </p>

          {contribution.cycles.map((cycle) => (
            <CycleRow key={cycle.id} cycle={cycle} />
          ))}
        </div>
      )}
    </div>
  );
}


function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-extrabold text-[#1c1c1c]">{value}</p>

      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function SchoolFeesPage() {
  const { summary, contributions, loading, error, reload } = useContributions();

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">School Fees</h1>

          <p className="mt-1 text-sm text-gray-500">
            Your contribution plans, term schedules and what has been paid out.
          </p>
        </div>

        <Link
          href="/contribute"
          className="rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
        >
          New contribution
        </Link>
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

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Annual fees"
            value={formatNaira(summary.annualFees)}
            hint="Total school-fee bill"
          />

          <StatCard
            label="Contribution target"
            value={formatNaira(summary.contributionTarget)}
            hint={`${summary.progressPct}% covered`}
          />

          <StatCard
            label="Contributed"
            value={formatNaira(summary.contributed)}
            hint="Paid upfront by you"
          />

          <StatCard
            label="Fees released"
            value={formatNaira(summary.feesPaid)}
            hint={`${summary.schoolFeesCovered} term(s) paid`}
          />
        </div>
      )}

      {summary && summary.contributionTarget > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
            <span>Contribution progress</span>
            <span>{summary.progressPct}%</span>
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#6d8f52] transition-all"
              style={{ width: `${Math.min(summary.progressPct, 100)}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {formatNaira(summary.contributed)} of{' '}
            {formatNaira(summary.contributionTarget)} ·{' '}
            {summary.activeCount} active plan(s)
          </p>
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-sm text-gray-500">
          Loading your school-fee plans…
        </div>
      ) : contributions.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-3xl">🎓</p>

          <h2 className="mt-3 text-lg font-bold">No school-fee plan yet</h2>

          <p className="mt-1 text-sm text-gray-500">
            Add your child, then make a single contribution covering 70% of the
            annual fees and we release each term&apos;s fees to the school.
          </p>

          <Link
            href="/beneficiary"
            className="mt-4 inline-block rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white"
          >
            Add beneficiary
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map((contribution) => (
            <ContributionCard key={contribution.id} contribution={contribution} />
          ))}
        </div>
      )}
    </section>
  );
}

