import Link from 'next/link';

export default function TermsPage() {
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
          Terms &amp; Conditions · Version 1.0
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1c1c1c]">
          Terms of Service
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Last updated: September 2026. These terms apply when you create a
          SKULPARTNERS account (consent version 1.0).
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              1. What SKULPARTNERS does
            </h2>
            <p className="mt-2">
              SKULPARTNERS is an education finance platform built around a
              “Pay Once, Study Free” model. Parents and guardians invest
              upfront, the investment earns a configurable daily return, and
              termly school fees are released to the child&apos;s school
              according to the investment cycle.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              2. Eligibility and your account
            </h2>
            <p className="mt-2">
              You must provide accurate registration details, verify your email
              and phone number, complete KYC verification, and keep your
              password and User ID safe. Your User ID is issued after onboarding
              and can be used to sign in alongside your email address.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              3. Investment and fees
            </h2>
            <p className="mt-2">
              The investment principal is 70% of the beneficiary&apos;s annual
              school fees, plus an insurance fee of 1.5% of the principal and a
              one-off maintenance fee. The exact total is always shown in the
              investment breakdown before you pay. Investment returns vary by
              cycle and are not guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              4. Compliance
            </h2>
            <p className="mt-2">
              Accounts follow Nigerian KYC/AML verification, NDPR data
              protection, and NDIC/SCUML-aligned processes. Transactions are
              recorded for audit. Non-compliance (for example, missed
              pre-session updates) may trigger a grace period, warnings,
              suspension, or fines as described in the product terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">
              5. Acceptable use
            </h2>
            <p className="mt-2">
              Do not share OTP codes, misrepresent school or beneficiary
              details, or use the platform for unlawful purposes. We may
              suspend or close accounts that breach these terms or applicable
              regulations.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1c1c1c]">6. Contact</h2>
            <p className="mt-2">
              Questions about these terms? Contact support from your dashboard.
              By accepting these terms during onboarding, you agree to version
              1.0 of this document.
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
            href="/privacy"
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Read Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
