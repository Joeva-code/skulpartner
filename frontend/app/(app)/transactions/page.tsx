'use client';

export default function TransactionsPage() {
  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-black">Transactions</h1>

      <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-3xl">🧾</p>

        <h2 className="mt-3 text-lg font-bold">No transactions yet</h2>

        <p className="mt-1 text-sm text-gray-500">
          Investments, school-fee payments, fees and insurance will show up
          here with filters and statements.
        </p>
      </div>
    </section>
  );
}