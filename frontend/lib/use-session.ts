import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchMe } from '@/lib/api';
import type { MeUser } from '@/lib/api';

export type { MeUser };

export function useSession() {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  return { user, loading };
}