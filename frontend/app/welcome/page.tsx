'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/use-session';
import WizardCard from '@/components/WizardCard';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useSession();

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
      title="Your account is ready 🎉"
      subtitle="A unique User ID has been issued for your SKULPARTNERS account."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Your User ID
          </p>

          <code className="mt-2 block break-all rounded-xl bg-gray-100 px-4 py-3 text-center text-sm font-bold tracking-wider text-[#1c1c1c]">
            {user.id}
          </code>

          <p className="mt-2 text-xs text-gray-500">
            Keep this ID safe. It is used for app login and account
            verification with our support team.
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          🔒 <strong>Security reminder:</strong> Never share your password,
          BVN, or OTP codes with anyone. SKULPARTNERS will never ask for your
          password.
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333]"
        >
          Go to your dashboard
        </button>

        <p className="text-center text-sm text-gray-500">
          Already signed in?{' '}
          <Link
            href="/dashboard"
            className="font-semibold text-[#6d8f52] hover:underline"
          >
            Go to your dashboard
          </Link>
        </p>
      </div>
    </WizardCard>
  );
}