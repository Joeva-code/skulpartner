'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthTabs({
  mode,
  onChange,
}: {
  mode?: 'login' | 'register';
  onChange?: (mode: 'login' | 'register') => void;
}) {
  const pathname = usePathname();
  const resolved: 'login' | 'register' =
    mode ?? (pathname?.startsWith('/register') ? 'register' : 'login');

  const tab =
    'flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition text-center';

  // Single-page mode: render buttons that switch forms in place.
  if (onChange) {
    return (
      <div>
        <div
          role="tablist"
          aria-label="Sign in or create account"
          className="grid grid-cols-2 gap-1 rounded-2xl bg-gray-100 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={resolved === 'login'}
            onClick={() => onChange('login')}
            className={
              resolved === 'login'
                ? `${tab} bg-white text-[#1c1c1c] shadow-sm`
                : `${tab} text-gray-500 hover:text-[#1c1c1c]`
            }
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={resolved === 'register'}
            onClick={() => onChange('register')}
            className={
              resolved === 'register'
                ? `${tab} bg-white text-[#1c1c1c] shadow-sm`
                : `${tab} text-gray-500 hover:text-[#1c1c1c]`
            }
          >
            Create account
          </button>
        </div>
      </div>
    );
  }

  // Legacy route mode: /login and /register links (kept for deep links).
  return (
    <div>
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-gray-100 p-1">
        <Link
          href="/login"
          aria-current={resolved === 'login' ? 'page' : undefined}
          className={
            resolved === 'login'
              ? `${tab} bg-white text-[#1c1c1c] shadow-sm`
              : `${tab} text-gray-500 hover:text-[#1c1c1c]`
          }
        >
          Sign in
        </Link>
        <Link
          href="/register"
          aria-current={resolved === 'register' ? 'page' : undefined}
          className={
            resolved === 'register'
              ? `${tab} bg-white text-[#1c1c1c] shadow-sm`
              : `${tab} text-gray-500 hover:text-[#1c1c1c]`
          }
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
