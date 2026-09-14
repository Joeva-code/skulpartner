import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f5] px-6 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm lg:p-12">
        <Link href="/" className="inline-flex items-center">
          <img
            src="/images/skulpartner_logo.svg"
            alt="SKULPARTNERS logo"
            className="h-14 w-auto"
          />
        </Link>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#6d8f52]">
          Privacy Policy · Version 1.0
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1c1c1c]">
          Privacy &amp; NDPR Notice
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Last updated: September 2026. This notice applies when you consent
          to data processing during onboarding (privacy version 1.0).
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              1. Data we collect
            </h2>
            <p className="mt-2">
              We collect account details (name, email, phone, password),
              verification data (OTP confirmations), KYC details (BVN, NIN,
              government ID and utility bill), beneficiary and school details,
              next-of-kin and bank details, and transaction records needed to
              operate investments and school-fee payments.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              2. Why we process your data
            </h2>
            <p className="mt-2">
              Your data is processed in line with the Nigeria Data Protection
              Regulation (NDPR) to create and secure your account, verify your
              identity under KYC/AML requirements, manage investments and
              payouts, issue receipts, and meet audit and regulatory
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              3. How we protect your data
            </h2>
            <p className="mt-2">
              Passwords are hashed, sessions expire, and sensitive identifiers
              are only used for verification. Never share your password, BVN,
              or OTP codes with anyone — SKULPARTNERS will never ask for your
              password.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              4. Sharing
            </h2>
            <p className="mt-2">
              We do not sell your data. Information is shared only with
              service providers needed to run the platform (for example,
              payment processing and verification), schools you designate for
              fee payments, and regulators or auditors where the law requires
              it.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              5. Your rights
            </h2>
            <p className="mt-2">
              You may request access, correction, or deletion of your personal
              data, and withdraw consent subject to legal and contractual
              retention duties. Contact support from your dashboard to exercise
              these rights.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-[#1c1c1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            Create account
          </Link>
          <Link
            href="/terms"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Read Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}
