'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchMe } from '@/lib/api';
import type { MeUser } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/school-fees', label: 'School Fees' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/profile', label: 'Profile' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<MeUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/login');
      });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login');
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <div className="text-sm text-gray-500">Loading your dashboard…</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f5] lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="px-6 py-6">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-[#1c1c1c]"
          >
            SKUL<span className="text-[#6d8f52]">PARTNERS</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pathname === item.href
                  ? 'bg-[#f1f7ed] text-[#3f5a2e]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-6 py-6">
          <p className="mb-2 break-words text-xs text-gray-400">
            Signed in as {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
                className="rounded-lg border border-gray-200 px-3 py-2 text-gray-600 lg:hidden"
              >
                {menuOpen ? '×' : '☰'}
              </button>

              <div>
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-sm font-bold">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white lg:hidden"
            >
              Logout
            </button>
          </div>

          {menuOpen && (
            <nav className="mt-4 flex flex-col gap-1 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    pathname === item.href
                      ? 'bg-[#f1f7ed] text-[#3f5a2e]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}