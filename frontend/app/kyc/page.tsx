'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/use-session';
import WizardCard from '@/components/WizardCard';

type KycRecord = {
  id: string;
  bvn: string | null;
  nin: string | null;
  idType: string | null;
  idNumber: string | null;
  idDocumentUrl: string | null;
  utilityBillUrl: string | null;
  status: string;
  submittedAt: string | null;
  reviewNote: string | null;
};

const fieldClass =
  'w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20';

export default function KycPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [kyc, setKyc] = useState<KycRecord | null>(null);
  const [form, setForm] = useState({
    bvn: '',
    nin: '',
    idType: '',
    idNumber: '',
    idDocumentUrl: '',
    utilityBillUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    api
      .get<KycRecord | null>('/kyc')
      .then((record) => {
        setKyc(record);

        if (record) {
          setForm({
            bvn: record.bvn ?? '',
            nin: record.nin ?? '',
            idType: record.idType ?? '',
            idNumber: record.idNumber ?? '',
            idDocumentUrl: record.idDocumentUrl ?? '',
            utilityBillUrl: record.utilityBillUrl ?? '',
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
      const record = await api.put<KycRecord>('/kyc', form);
      setKyc(record);
      setMessage('KYC details saved.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save KYC details',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const record = await api.post<KycRecord>('/kyc/submit');
      setKyc(record);
      setMessage(
        'Submitted for verification. You will be notified once it is reviewed.',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  }

  const status = kyc?.status;

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <WizardCard
      step={2}
      title="Verify your identity (KYC)"
      subtitle="We use these details to comply with Nigerian KYC/AML regulations. Your data is encrypted and secure."
    >
      <div className="space-y-4">
        {status === 'VERIFIED' && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ Identity verified
          </p>
        )}

        {status === 'FAILED' && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Verification failed
            {kyc?.reviewNote ? `: ${kyc.reviewNote}` : ''}. Update your
            details and resubmit.
          </p>
        )}

        {status === 'PENDING' && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            KYC submitted — pending verification.
          </p>
        )}

        <div>
          <label
            htmlFor="bvn"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            BVN
          </label>
          <input
            id="bvn"
            value={form.bvn}
            onChange={(event) => update('bvn', event.target.value)}
            placeholder="Bank Verification Number"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="nin"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            NIN
          </label>
          <input
            id="nin"
            value={form.nin}
            onChange={(event) => update('nin', event.target.value)}
            placeholder="National Identification Number"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="idType"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Government ID type
          </label>
          <select
            id="idType"
            value={form.idType}
            onChange={(event) => update('idType', event.target.value)}
            className={fieldClass}
          >
            <option value="">Select ID type</option>
            <option>National ID</option>
            <option>International Passport</option>
            <option>Driver&apos;s Licence</option>
            <option>Voter&apos;s Card</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="idNumber"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            ID number
          </label>
          <input
            id="idNumber"
            value={form.idNumber}
            onChange={(event) => update('idNumber', event.target.value)}
            placeholder="ID document number"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="idDocumentUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Government ID document
          </label>
          <input
            id="idDocumentUrl"
            value={form.idDocumentUrl}
            onChange={(event) => update('idDocumentUrl', event.target.value)}
            placeholder="File upload coming soon — paste a link for now"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="utilityBillUrl"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Utility bill
          </label>
          <input
            id="utilityBillUrl"
            value={form.utilityBillUrl}
            onChange={(event) => update('utilityBillUrl', event.target.value)}
            placeholder="File upload coming soon — paste a link for now"
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

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || submitting}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Save
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || saving}
            className="flex-1 rounded-xl bg-[#1c1c1c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit for verification'}
          </button>
        </div>

        <button
          onClick={() => router.push('/beneficiary')}
          className="w-full text-center text-sm font-semibold text-[#6d8f52] hover:underline"
        >
          Continue to beneficiary →
        </button>
      </div>
    </WizardCard>
  );
}