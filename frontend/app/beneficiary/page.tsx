'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useSession } from '@/lib/use-session';
import WizardCard from '@/components/WizardCard';

type Beneficiary = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  grade: string | null;
  annualFee: string;
  school: { id: string; name: string } | null;
};

const fieldClass =
  'w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20';

const emptyForm = {
  firstName: '',
  lastName: '',
  dob: '',
  schoolName: '',
  grade: '',
  annualFee: '',
};

export default function BeneficiaryPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [schoolNames, setSchoolNames] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    api
      .get<Beneficiary[]>('/beneficiaries')
      .then(setBeneficiaries)
      .catch(() => undefined);

    api
      .get<{ id: string; name: string }[]>('/schools')
      .then((list) => setSchoolNames(list.map((school) => school.name)))
      .catch(() => undefined);
  }, [user]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAdd() {
    setSaving(true);
    setError('');

    try {
      const beneficiary = await api.post<Beneficiary>('/beneficiaries', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dob: form.dob || undefined,
        schoolName: form.schoolName.trim() || undefined,
        grade: form.grade.trim() || undefined,
        annualFee: Number(form.annualFee),
      });

      setBeneficiaries((prev) => [...prev, beneficiary]);
      setForm(emptyForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add beneficiary',
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
      step={3}
      title="Your child (beneficiary)"
      subtitle="Add the student(s) this investment covers. You can add more than one."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First name
            </label>
            <input
              id="firstName"
              value={form.firstName}
              onChange={(event) => update('firstName', event.target.value)}
              placeholder="Chiamaka"
              className={fieldClass}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last name
            </label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={(event) => update('lastName', event.target.value)}
              placeholder="Okafor"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="dob"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Date of birth
          </label>
          <input
            id="dob"
            type="date"
            value={form.dob}
            onChange={(event) => update('dob', event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="schoolName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            School
          </label>
          <input
            id="schoolName"
            list="schools"
            value={form.schoolName}
            onChange={(event) => update('schoolName', event.target.value)}
            placeholder="School name"
            className={fieldClass}
          />
          <datalist id="schools">
            {schoolNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div>
          <label
            htmlFor="grade"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Class / grade
          </label>
          <input
            id="grade"
            value={form.grade}
            onChange={(event) => update('grade', event.target.value)}
            placeholder="e.g. JSS 1"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="annualFee"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Annual school fees (₦)
          </label>
          <input
            id="annualFee"
            type="number"
            min={0}
            value={form.annualFee}
            onChange={(event) => update('annualFee', event.target.value)}
            placeholder="e.g. 149000"
            className={fieldClass}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={saving}
          className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:opacity-60"
        >
          {saving ? 'Adding…' : 'Add beneficiary'}
        </button>

        {beneficiaries.length > 0 && (
          <div className="space-y-2">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="rounded-2xl border border-gray-200 p-4 text-sm"
              >
                <p className="font-semibold">
                  {beneficiary.firstName} {beneficiary.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {beneficiary.school?.name ?? 'School not set'}
                  {beneficiary.grade ? ` · ${beneficiary.grade}` : ''}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#6d8f52]">
                  ₦{Number(beneficiary.annualFee).toLocaleString()} / year
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push('/next-of-kin')}
          className="w-full text-center text-sm font-semibold text-[#6d8f52] hover:underline"
        >
          Continue to next of kin →
        </button>
      </div>
    </WizardCard>
  );
}