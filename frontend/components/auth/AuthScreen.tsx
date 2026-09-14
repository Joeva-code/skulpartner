'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import AuthTabs from '@/components/auth/AuthTabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

function AuthBanner() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === '1';
  const reset = searchParams.get('reset') === '1';

  if (reset) {
    return (
      <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
        Password reset successfully. Please sign in with your new password.
      </p>
    );
  }

  if (!registered) {
    return null;
  }

  return (
    <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
      Account created successfully. Please sign in.
    </p>
  );
}

function AuthScreenInner({
  defaultMode,
}: {
  defaultMode: 'login' | 'register';
}) {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const initial: 'login' | 'register' =
    modeParam === 'register'
      ? 'register'
      : modeParam === 'login'
        ? 'login'
        : defaultMode;

  const [mode, setMode] = useState<'login' | 'register'>(initial);

  return (
    <AuthShell>
      {/* Tabs switch login/register in place — same page, hero stays put */}
      <AuthTabs mode={mode} onChange={setMode} />

      {mode === 'login' ? (
        <>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#1c1c1c] sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in with your email address or User ID to manage your education
            investment.
          </p>

          <div className="mt-5">
            <AuthBanner />
          </div>

          <LoginForm />
        </>
      ) : (
        <>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#1c1c1c] sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start investing in your child&apos;s education today. It takes less
            than 10 minutes.
          </p>

          <RegisterForm />
        </>
      )}
    </AuthShell>
  );
}

export default function AuthScreen({
  defaultMode = 'login',
}: {
  defaultMode?: 'login' | 'register';
}) {
  return (
    <Suspense fallback={null}>
      <AuthScreenInner defaultMode={defaultMode} />
    </Suspense>
  );
}
