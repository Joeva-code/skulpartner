'use client';

export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-black">Profile &amp; Security</h1>

      <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-3xl">🔐</p>

        <h2 className="mt-3 text-lg font-bold">Coming soon</h2>

        <p className="mt-1 text-sm text-gray-500">
          Profile, beneficiaries, KYC status, 2FA and devices will live here.
        </p>
      </div>
    </section>
  );
}