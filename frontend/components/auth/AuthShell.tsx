import type { ReactNode } from 'react';
import AuthHero from './AuthHero';

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f8f8f5]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1280px] lg:grid-cols-[1.05fr_1fr]">
        {/* Hero: top on mobile, side on desktop */}
        <AuthHero />

        {/* Form column */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:py-12">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
