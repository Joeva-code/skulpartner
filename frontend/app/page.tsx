"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "🛡️",
    title: "Safe & Compliant",
    description:
      "Built with NDIC, SCUML, AML/KYC and NDPR standards.",
  },
  {
    icon: "🐷",
    title: "Smart Investment",
    description:
      "Grow your money while securing your child’s education.",
  },
  {
    icon: "🎓",
    title: "Automated Payments",
    description:
      "School fees paid on time, every term.",
  },
  {
    icon: "📱",
    title: "Easy to Use",
    description:
      "Simple. Mobile-first. Designed for everyone.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Register & verify",
    description:
      "Create your account in minutes, verify your email and phone, and complete KYC.",
  },
  {
    step: "02",
    title: "Add your child & fees",
    description:
      "Tell us the school and annual fees. We compute a 70% investment requirement automatically.",
  },
  {
    step: "03",
    title: "Pay once, invest",
    description:
      "Pay your investment upfront via card, transfer or USSD, and your cycle starts earning daily.",
  },
  {
    step: "04",
    title: "We pay school fees",
    description:
      "When each term arrives, we release the school fees to your child's school — on time, every term.",
  },
];

const faqs = [
  {
    question: "How does “Pay Once, Study Free” work?",
    answer:
      "Instead of saving separately for each term, you invest 70% of your child's annual school fees upfront. Your money earns a daily return, and each term we use the returns to cover the school fees.",
  },
  {
    question: "Is my money safe?",
    answer:
      "We follow Nigerian compliance practices — including AML/KYC verification, NDIC and SCUML-aligned processes and NDPR data protection — and every transaction is recorded for audit. Always invest only what you can afford.",
  },
  {
    question: "What are the fees?",
    answer:
      "You pay your investment principal (70% of annual fees), plus an insurance fee of 1.5% of the principal and a one-off maintenance fee. The exact maintenance fee is shown before you pay, so there are no surprises.",
  },
  {
    question: "How much do I earn daily?",
    answer:
      "Your investment earns a daily return in the range of 0.8% to 1% of your principal, depending on the current cycle. Your dashboard shows your daily and total profit in real time.",
  },
  {
    question: "Can I track my money?",
    answer:
      "Yes. Your dashboard shows your investment balance, wallet, daily and total profit, cycle progress, and a full transaction history with downloadable statements.",
  },
  {
    question: "What happens when a term is paid?",
    answer:
      "We release the term fees to your child's school and generate a receipt you can view, download or print. You can also upload the school's receipt to confirm the payment.",
  },
  {
    question: "Can I add more than one child?",
    answer:
      "Yes. You can add multiple beneficiaries, each with their own school and fee schedule, all managed from a single account.",
  },
  {
    question: "What happens to my remaining funds?",
    answer:
      "Any surplus from your investment remains in your wallet. On graduation, remaining funds move to a communal pool per our product terms.",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#09252a]">
      {/* Header */}
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <img
            src="/images/skulpartner_logo.svg"
            alt="SKULPARTNERS logo"
            className="h-16 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-[12px] text-slate-500 lg:flex">
          <a
            href="#home"
            className="border-b-2 border-[#08794d] pb-2 font-bold text-[#08794d]"
          >
            Home
          </a>

          <a
            href="#about"
            className="transition hover:text-[#08794d]"
          >
            About
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-[#08794d]"
          >
            How It Works
          </a>

          <a
            href="#faqs"
            className="transition hover:text-[#08794d]"
          >
            FAQs
          </a>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            className="text-[12px] font-bold text-[#075b3c] hover:text-[#08794d]"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-[#08794d] px-5 py-3 text-[12px] font-bold text-white transition hover:bg-[#05623d]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xl text-[#08794d] lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="mx-6 mb-5 flex flex-col gap-4 rounded-2xl bg-[#effaf5] p-5 text-sm font-semibold text-[#075b3c] lg:hidden">
          <a
            href="#home"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>

          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
          >
            How It Works
          </a>

          <a
            href="#faqs"
            onClick={() => setMenuOpen(false)}
          >
            FAQs
          </a>

          <Link href="/login">Log In</Link>

          <Link
            href="/register"
            className="rounded-full bg-[#08794d] px-5 py-3 text-center text-white"
          >
            Get Started
          </Link>
        </nav>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="mx-auto grid max-w-[1180px] items-center gap-8 px-6 pb-0 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pt-6"
      >
        {/* Hero Text */}
        <div className="relative z-20 max-w-[480px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e7f7ef] px-3 py-2 text-[10px] font-semibold text-[#08794d]">
            <span>🛡</span>
            <span>Secure</span>
            <span>•</span>
            <span>Transparent</span>
            <span>•</span>
            <span>Trusted</span>
          </div>

          <h1 className="text-[48px] font-extrabold leading-[0.98] tracking-[-2px] text-[#09252a] sm:text-[60px] lg:text-[64px]">
            Pay Once,
            <br />
            <span className="text-[#08794d]">Study Free</span>
          </h1>

          <p className="mt-5 max-w-[390px] text-[13px] leading-[1.65] text-slate-500">
            SKULPARTNERS helps parents and guardians invest today for
            their children&apos;s education. We manage your school fees
            through smart investments, so your child can focus on what
            matters most — learning.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-4 rounded-full bg-[#08794d] px-5 py-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#05623d]"
            >
              Get Started
              <span className="text-base">→</span>
            </Link>

            <a
              href="#how-it-works"
              className="rounded-full border border-[#08794d] px-6 py-3 text-[11px] font-bold text-[#08794d] transition hover:bg-[#effaf5]"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Image Area */}
        <div className="relative min-h-[420px] lg:min-h-[475px]">
          {/* Decorative Background Shapes */}
          <div className="absolute right-8 top-0 h-[270px] w-[270px] rounded-full bg-[#e7f6ef]" />

          <div className="absolute bottom-5 right-0 h-[230px] w-[350px] rounded-[48%] bg-[#edf9f3]" />

          <div className="absolute left-8 top-20 h-[270px] w-[270px] rounded-[45%] bg-[#eaf8f1]" />

          {/* Generated Schoolgirl Image */}
          <div className="relative z-10 flex h-full items-end justify-center">
            <img
              src="/images/Schoolgirl.png"
              alt="Smiling Nigerian schoolgirl wearing a green school uniform, carrying a school bag and holding books"
              className="h-[400px] w-[360px] object-contain object-bottom sm:h-[465px] sm:w-[420px]"
            />
          </div>

          {/* Floating Security Card */}
          <div className="absolute bottom-8 right-0 z-30 flex w-[225px] items-center gap-3 rounded-xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:bottom-6 sm:right-2 sm:w-[255px]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff6e9] text-xl font-bold text-[#08794d]">
              ↗
            </div>

            <div>
              <h2 className="text-[11px] font-extrabold leading-4 text-[#09252a]">
                Your Child&apos;s Future
                <br />
                Is Secured
              </h2>

              <p className="mt-1 text-[8px] text-slate-500">
                Invest • Track • Pay School Fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="about"
        className="bg-[#f1fbf7] px-6 py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto mb-12 max-w-[1180px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#08794d]">
            Why SKULPARTNERS
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#09252a] lg:text-4xl">
            Trusted, simple and transparent
          </h2>

          <p className="mx-auto mt-4 max-w-[520px] text-[13px] leading-relaxed text-slate-500">
            Built to make school-fee planning safe and stress-free for every
            Nigerian parent.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1180px] gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d9f3e7] text-2xl">
                {feature.icon}
              </div>

              <h2 className="text-[13px] font-extrabold text-[#075b3c]">
                {feature.title}
              </h2>

              <p className="mt-2 max-w-[210px] text-[11px] leading-[1.7] text-slate-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#08794d]">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#09252a] lg:text-4xl">
              Your child&apos;s education, funded in 4 steps
            </h2>

            <p className="mx-auto mt-4 max-w-[520px] text-[13px] leading-relaxed text-slate-500">
              From sign-up to termly payments, SKULPARTNERS handles the money
              so you can focus on your child.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl bg-[#f1fbf7] p-6"
              >
                <span className="text-3xl font-extrabold text-[#08794d]/25">
                  {item.step}
                </span>

                <h3 className="mt-3 text-[15px] font-extrabold text-[#075b3c]">
                  {item.title}
                </h3>

                <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Example */}
      <section className="bg-[#f1fbf7] px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#08794d]">
              Transparent by design
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#09252a] lg:text-4xl">
              See exactly where your money goes
            </h2>

            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
              No hidden fees. Your investment is broken down clearly before you
              pay, and your returns are tracked daily. Here is an illustrative
              example of the standard model:
            </p>

            <ul className="mt-6 space-y-3 text-[13px] text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f3e7] text-[10px] font-bold text-[#08794d]">
                  ✓
                </span>
                Annual school fees — ₦149,000
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f3e7] text-[10px] font-bold text-[#08794d]">
                  ✓
                </span>
                70% investment requirement — ₦104,300
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f3e7] text-[10px] font-bold text-[#08794d]">
                  ✓
                </span>
                Daily return at 0.8% — ₦837.20
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f3e7] text-[10px] font-bold text-[#08794d]">
                  ✓
                </span>
                Cycle 1 total profit (123 days) — ₦102,975.60
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f3e7] text-[10px] font-bold text-[#08794d]">
                  ✓
                </span>
                Term 1 fee covered — ₦65,000
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d9f3e7] text-[10px] font-bold text-[#08794d]">
                  ✓
                </span>
                Surplus — ₦27,678
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#09252a]">
              Investment breakdown
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Illustrative example — figures are configurable
            </p>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Annual school fees</dt>
                <dd className="font-bold">₦149,000</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Investment (70%)</dt>
                <dd className="font-bold">₦104,300</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Insurance (1.5%)</dt>
                <dd className="font-bold">₦1,564.50</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Maintenance</dt>
                <dd className="font-bold">₦4,500</dd>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <dt className="font-bold text-[#09252a]">Total to pay</dt>
                <dd className="text-lg font-extrabold text-[#08794d]">
                  ₦110,364.50
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="bg-white px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[760px]">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#08794d]">
              FAQs
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#09252a] lg:text-4xl">
              Questions, answered
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[13px] font-bold text-[#09252a]">
                      {faq.question}
                    </span>

                    <span
                      className={`shrink-0 text-lg text-[#08794d] transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <p className="px-5 pb-5 text-[12px] leading-relaxed text-slate-500">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#09252a] px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            Pay once. Study free.
          </h2>

          <p className="max-w-[520px] text-[13px] leading-relaxed text-slate-300">
            Join SKULPARTNERS today and give your child a funded, protected
            education — planned, tracked and secure in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-full bg-[#08794d] px-6 py-3 text-[12px] font-bold text-white transition hover:bg-[#05623d]"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-[12px] font-bold text-white transition hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-6">
          <img
            src="/images/skulpartner_logo.svg"
            alt="SKULPARTNERS logo"
            className="h-12 w-auto"
          />

          <nav className="flex flex-wrap justify-center gap-6 text-[12px] text-slate-500">
            <a href="#about" className="transition hover:text-[#08794d]">
              About
            </a>

            <a href="#how-it-works" className="transition hover:text-[#08794d]">
              How It Works
            </a>

            <a href="#faqs" className="transition hover:text-[#08794d]">
              FAQs
            </a>

            <Link href="/terms" className="transition hover:text-[#08794d]">
              Terms
            </Link>

            <Link href="/privacy" className="transition hover:text-[#08794d]">
              Privacy
            </Link>

            <Link href="/login" className="transition hover:text-[#08794d]">
              Log In
            </Link>

            <Link href="/register" className="transition hover:text-[#08794d]">
              Get Started
            </Link>
          </nav>

          <p className="max-w-[720px] text-center text-[11px] leading-relaxed text-slate-400">
            SKULPARTNERS is an education finance platform. Compliance
            statements are based on product requirements and are not
            independently verified regulatory claims. Investments carry risk
            and returns are not guaranteed.
          </p>

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SKULPARTNERS. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}