'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <main className="max-w-sm mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold glow-text mb-4">Почти готово</h1>
        <p className="text-white/60">
          Проверь почту {email} — подтверди аккаунт по ссылке, потом{' '}
          <Link href="/login" className="text-orange-400 hover:underline">
            войди
          </Link>{' '}
          и введи код приглашения.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold glow-text mb-6 text-center">Регистрация</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Пароль (мин. 6 символов)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Создаю...' : 'Создать аккаунт'}
        </button>
      </form>
      <p className="text-white/50 text-sm text-center mt-6">
        Уже есть аккаунт? <Link href="/login" className="text-orange-400 hover:underline">Войти</Link>
      </p>
    </main>
  );
}
