'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc('redeem_invite_code', { p_code: code.trim() });
    setLoading(false);
    if (error || data !== true) {
      setError('Код не найден или уже использован — проверь и попробуй ещё раз.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold glow-text mb-3 text-center">Код приглашения</h1>
      <p className="text-white/50 text-sm text-center mb-6">
        ReelCoach пока в закрытом бета-тесте — введи код, который тебе дали.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="COACH-XXXX"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="input text-center tracking-wider"
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Проверяю...' : 'Подтвердить'}
        </button>
      </form>
    </main>
  );
}
