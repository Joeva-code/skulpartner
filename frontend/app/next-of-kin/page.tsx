'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/use-session';
import WizardCard from '@/components/WizardCard';

const fieldClass =
  'w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20';

export default function NextOfKinPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [form, setForm] = useState({
    fullName: '',
    relationship: '',
    phone: '',
    email: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    api
      .get<{
        fullName: string | null;
        relationship: string | null;
        phone: string | null;
        email: string | null;
        bankName: string | null;
        bankAccountName: string | null;
        bankAccountNumber: string | null;
      } | null>('/next-of-kin')
      .then((record) => {
        if (record) {
          setForm({
            fullName: record.fullName ?? '',
            relationship: record.relationship ?? '',
            phone: record.phone ?? '',
            email: record.email ?? '',
            bankName: record.bankName ?? '',
            bankAccountName: record.bankAccountName ?? '',
            bankAccountNumber: record.bankAccountNumber ?? '',
          });
        }
      })
      .catch(() => undefined);
  }, [user]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await api.put('/next-of-kin', form);
      setMessage('Next of kin saved.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save next of kin',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <WizardCard
      step={4}
      title="Next of kin"
      subtitle="Tell us who to contact in an emergency and who handles the account if something happens to you."
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full name
          </label>
          <input
            id="fullName"
            value={form.fullName}
            onChange={(event) => update('fullName', event.target.value)}
            placeholder="Full name"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="relationship"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Relationship
          </label>
          <input
            id="relationship"
            value={form.relationship}
            onChange={(event) => update('relationship', event.target.value)}
            placeholder="e.g. Spouse, Sister"
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="+234..."
              className={fieldClass}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bankName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Bank name
          </label>
          <input
            id="bankName"
            value={form.bankName}
            onChange={(event) => update('bankName', event.target.value)}
            placeholder="e.g. GTBank"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="bankAccountName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Account name
          </label>
          <input
            id="bankAccountName"
            value={form.bankAccountName}
            onChange={(event) => update('bankAccountName', event.target.value)}
            placeholder="Account name"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="bankAccountNumber"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Account number
          </label>
          <input
            id="bankAccountNumber"
            value={form.bankAccountNumber}
            onChange={(event) => update('bankAccountNumber', event.target.value)}
            placeholder="10-digit account number"
            className={fieldClass}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save & continue'}
        </button>

        <button
          onClick={() => router.push('/consent')}
          className="w-full text-center text-sm font-semibold text-[#6d8f52] hover:underline"
        >
          Continue to consent →
        </button>
      </div>
    </WizardCard>
  );
}