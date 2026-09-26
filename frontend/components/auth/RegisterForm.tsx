'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const input =
  'w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#6d8f52] focus:ring-2 focus:ring-[#6d8f52]/20';

export default function RegisterForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post(
        '/auth/register',
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          phone: phone.trim() || undefined,
          password,
        },
        { auth: false },
      );

      const data = await api.post<{
        accessToken: string;
        user: { id: string; email: string; role: string };
      }>(
        '/auth/login',
        { identifier: email, password },
        { auth: false },
      );

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="auth-firstName" className="mb-1 block text-sm font-medium text-gray-700">First name</label>
          <input id="auth-firstName" type="text" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ada" className={input} />
        </div>
        <div>
          <label htmlFor="auth-lastName" className="mb-1 block text-sm font-medium text-gray-700">Last name</label>
          <input id="auth-lastName" type="text" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Obi" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
        <input id="auth-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
      </div>
      <div>
        <label htmlFor="auth-phone" className="mb-1 block text-sm font-medium text-gray-700">Phone number <span className="text-gray-400">(optional)</span></label>
        <input id="auth-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" className={input} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="auth-new-password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input id="auth-new-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 chars" className={input} />
        </div>
        <div>
          <label htmlFor="auth-confirm-password" className="mb-1 block text-sm font-medium text-gray-700">Confirm</label>
          <input id="auth-confirm-password" type="password" required autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat" className={input} />
        </div>
      </div>
      {error && (<p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>)}
      <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#1c1c1c] px-4 py-3 font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? 'Creating account...' : 'Create account'}
      </button>
      <p className="text-center text-xs text-gray-400">
        By creating an account you agree to our <Link href="/terms" className="font-semibold hover:underline">Terms</Link> and <Link href="/privacy" className="font-semibold hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  );
}
