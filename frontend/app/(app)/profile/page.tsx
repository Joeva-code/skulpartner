'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, fetchMe } from '@/lib/api';
import type { MeUser } from '@/lib/api';
import { getNextOnboardingStep } from '@/lib/use-onboarding-status';
import type { OnboardingStatus } from '@/lib/use-onboarding-status';

type KycRecord = {
  id: string;
  bvn: string | null;
  nin: string | null;
  idType: string | null;
  idNumber: string | null;
  status: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
} | null;

type Beneficiary = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  grade: string | null;
  annualFee: string | number;
  status: string;
  school: { id: string; name: string; city: string | null; state: string | null } | null;
};

type NextOfKin = {
  id: string;
  fullName: string;
  relationship: string;
  phone: string | null;
  email: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
} | null;

const naira = (value: string | number | null | undefined) =>
  `₦${Number(value ?? 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const shortDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const masked = (value: string | null | undefined) => {
  if (!value) return '—';
  if (value.length <= 4) return '•'.repeat(value.length);
  return `${'•'.repeat(value.length - 4)}${value.slice(-4)}`;
};

type Tone = 'good' | 'warn' | 'bad' | 'neutral';

const toneClasses: Record<Tone, string> = {
  good: 'bg-green-100 text-green-800',
  warn: 'bg-amber-100 text-amber-800',
  bad: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-700',
};

function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold break-words sm:text-right">{value}</span>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#1c1c1c]">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [kyc, setKyc] = useState<KycRecord>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [kin, setKin] = useState<NextOfKin>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMe()
      .then((me) => {
        setUser(me);
        return Promise.all([
          api
            .get<OnboardingStatus>('/onboarding/status')
            .then(setStatus)
            .catch(() => undefined),
          api
            .get<KycRecord>('/kyc')
            .then(setKyc)
            .catch(() => undefined),
          api
            .get<Beneficiary[]>('/beneficiaries')
            .then((rows) => setBeneficiaries(Array.isArray(rows) ? rows : []))
            .catch(() => undefined),
          api
            .get<NextOfKin>('/next-of-kin')
            .then(setKin)
            .catch(() => undefined),
        ]);
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : 'Failed to load your profile',
        ),
      );
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

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
          Loading your profile…
        </div>
      </section>
    );
  }

  const next = getNextOnboardingStep(status);
  const emailTone: Tone = user.emailVerified ? 'good' : 'warn';
  const phoneTone: Tone = !user.phone
    ? 'neutral'
    : user.phoneVerified
      ? 'good'
      : 'warn';
  const statusTone: Tone =
    user.status === 'ACTIVE'
      ? 'good'
      : user.status === 'CLOSED'
        ? 'bad'
        : 'warn';
  const kycTone: Tone = !kyc
    ? 'warn'
    : kyc.status === 'VERIFIED'
      ? 'good'
      : kyc.status === 'FAILED'
        ? 'bad'
        : 'warn';

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1c1c1c] text-xl font-black text-white">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black text-[#1c1c1c]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm break-words text-gray-500">{user.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="neutral">{user.role}</Badge>
              <Badge tone={statusTone}>{user.status}</Badge>
              <Badge tone={emailTone}>
                {user.emailVerified ? '✓ Email verified' : 'Email unverified'}
              </Badge>
              <Badge tone={phoneTone}>
                {user.phone
                  ? user.phoneVerified
                    ? '✓ Phone verified'
                    : 'Phone unverified'
                  : 'No phone on file'}
              </Badge>
            </div>
          </div>
        </div>
      </div>


      <Section
        title="Onboarding"
        action={
          <Link
            href={next.href}
            className="rounded-xl bg-[#1c1c1c] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#333333]"
          >
            {next.key === 'done' ? 'Review dashboard' : next.label}
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: 'Contact verification',
              done: Boolean(status?.emailVerified) &&
                Boolean(!status?.phone || status?.phoneVerified),
              href: '/verify',
            },
            {
              label: 'KYC',
              done: Boolean(status?.kyc),
              href: '/kyc',
            },
            {
              label: 'Beneficiary',
              done: (status?.beneficiaryCount ?? 0) > 0,
              href: '/beneficiary',
            },
            {
              label: 'Next of kin',
              done: Boolean(status?.hasNextOfKin),
              href: '/next-of-kin',
            },
            {
              label: 'Consent',
              done: Boolean(status?.hasConsent),
              href: '/consent',
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold transition hover:border-[#6d8f52] hover:bg-[#f9fbf7]"
            >
              <span>{item.label}</span>
              <Badge tone={item.done ? 'good' : 'warn'}>
                {item.done ? 'Complete' : 'Pending'}
              </Badge>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Account details">
        <div>
          <DetailRow label="User ID" value={<code className="text-xs">{user.id}</code>} />
          <DetailRow label="Full name" value={`${user.firstName} ${user.lastName}`} />
          <DetailRow label="Email address" value={user.email} />
          <DetailRow label="Phone number" value={user.phone ?? 'Not provided'} />
          <DetailRow label="Role" value={user.role} />
          <DetailRow label="Account status" value={user.status} />
          <DetailRow label="Member since" value={shortDate(user.createdAt)} />
        </div>
      </Section>


      <Section
        title="KYC verification"
        action={
          <Link
            href="/kyc"
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Update KYC
          </Link>
        }
      >
        {kyc ? (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone={kycTone}>{kyc.status}</Badge>
              {kyc.submittedAt && (
                <span className="text-xs text-gray-500">
                  Submitted {shortDate(kyc.submittedAt)}
                </span>
              )}
            </div>
            <DetailRow label="BVN" value={masked(kyc.bvn)} />
            <DetailRow label="NIN" value={masked(kyc.nin)} />
            <DetailRow label="ID type" value={kyc.idType ?? '—'} />
            <DetailRow label="ID number" value={masked(kyc.idNumber)} />
            {kyc.reviewedAt && (
              <DetailRow label="Reviewed" value={shortDate(kyc.reviewedAt)} />
            )}
            {kyc.reviewNote && (
              <DetailRow label="Review note" value={kyc.reviewNote} />
            )}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
            No KYC record yet. Complete KYC to unlock contributions.
          </p>
        )}
      </Section>

      <Section
        title="Beneficiaries"
        action={
          <Link
            href="/beneficiary"
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Add beneficiary
          </Link>
        }
      >
        {beneficiaries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
            No beneficiaries added yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {beneficiaries.map((child) => (
              <li
                key={child.id}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {child.school?.name ?? 'No school assigned'}
                      {child.grade ? ` • ${child.grade}` : ''}
                    </p>
                  </div>

                  <Badge tone={child.status === 'ACTIVE' ? 'good' : 'neutral'}>
                    {child.status}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>Date of birth: {shortDate(child.dob)}</span>
                  <span>Annual fees: {naira(child.annualFee)}</span>
                  <span>70% target: {naira(Number(child.annualFee) * 0.7)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>


      <Section
        title="Next of kin"
        action={
          <Link
            href="/next-of-kin"
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Update
          </Link>
        }
      >
        {kin ? (
          <div>
            <DetailRow label="Full name" value={kin.fullName} />
            <DetailRow label="Relationship" value={kin.relationship} />
            <DetailRow label="Phone" value={kin.phone ?? '—'} />
            <DetailRow label="Email" value={kin.email ?? '—'} />
            <DetailRow label="Bank" value={kin.bankName ?? '—'} />
            <DetailRow label="Account name" value={kin.bankAccountName ?? '—'} />
            <DetailRow
              label="Account number"
              value={masked(kin.bankAccountNumber)}
            />
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
            No next of kin on file.
          </p>
        )}
      </Section>

      <Section title="Security">
        <div>
          <DetailRow
            label="Password"
            value={
              <Link href="/forgot-password" className="text-[#3f5a2e] hover:underline">
                Change password
              </Link>
            }
          />
          <DetailRow label="Two-factor authentication" value="Not enabled" />
          <DetailRow label="Signed-in device" value="This browser" />
        </div>

        <button
          onClick={handleLogout}
          className="mt-5 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Log out
        </button>
      </Section>
    </section>
  );
}
