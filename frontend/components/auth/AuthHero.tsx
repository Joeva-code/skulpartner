import Link from 'next/link';

const steps = [
  {
    num: '01',
    title: 'Contribute 70% upfront',
    text: 'We compute 70% of annual fees + insurance + maintenance.',
  },
  {
    num: '02',
    title: 'Track your progress',
    text: 'Follow your contribution progress and school-fee targets on your dashboard.',
  },
  {
    num: '03',
    title: 'We pay school fees',
    text: "Every term, fees go straight to your child's school — with receipts.",
  },
];

const trust = ['🔒 NDPR-safe data', '✅ KYC / AML verified', '🧾 Audited receipts'];

export default function AuthHero() {
  return (
    <aside className="relative overflow-hidden bg-[#09252a] text-white">
      {/* soft decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#08794d]/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#6d8f52]/20 blur-3xl"
      />

      <div className="relative flex h-full flex-col px-6 py-8 sm:px-10 lg:justify-between lg:p-12">
        {/* brand */}
        <Link href="/" className="inline-flex w-fit items-center rounded-2xl bg-white/95 px-3 py-2">
          <img
            src="/images/skulpartner_logo.svg"
            alt="SKULPARTNERS logo"
            className="h-9 w-auto"
          />
        </Link>

        {/* headline */}
        <div className="mt-8 lg:mt-10">
          <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
            Pay Once, Study Free
          </p>

          <h2 className="mt-4 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Your child&apos;s education, planned, funded and protected.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Contribute once upfront, track your education funding progress, and
            let SKULPARTNERS release every term&apos;s school fees on time —
            with receipts and full transparency.
          </p>

          {/* steps */}
          <ol className="mt-6 hidden max-w-md space-y-3 sm:block">
            {steps.map((s) => (
              <li
                key={s.num}
                className="flex gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#08794d] text-xs font-extrabold">
                  {s.num}
                </span>
                <span>
                  <span className="block text-sm font-bold">{s.title}</span>
                  <span className="block text-xs leading-relaxed text-slate-300">
                    {s.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* showcase card */}
        <div className="mt-8 hidden items-center gap-5 rounded-3xl bg-white p-4 text-[#1c1c1c] sm:flex lg:mt-10">
          <img
            src="/images/Schoolgirl.png"
            alt="Smiling schoolgirl in uniform"
            className="h-28 w-24 shrink-0 rounded-2xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#08794d]">
              Next term fee covered
            </p>
            <p className="mt-1 text-2xl font-extrabold">₦65,000</p>
            <p className="mt-1 text-xs text-gray-500">
              Cycle 1 · Day 84 of 123 · 68% complete
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-2 w-[68%] rounded-full bg-[#08794d]" />
            </div>
          </div>
        </div>

        {/* trust row */}
        <div className="mt-8 flex flex-wrap gap-2 lg:mt-10">
          {trust.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-200 ring-1 ring-white/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
