import Link from 'next/link';
import type { ReactNode } from 'react';
import OnboardingProgress from './OnboardingProgress';

export default function WizardCard({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5] px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <Link href="/" className="inline-flex items-center">
          <img
            src="/images/skulpartner_logo.svg"
            alt="SKULPARTNERS logo"
            className="h-12 w-auto"
          />
        </Link>

        <div className="mt-8">
          <OnboardingProgress step={step} />
        </div>

        <h1 className="text-2xl font-bold text-[#1c1c1c]">{title}</h1>

        {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}