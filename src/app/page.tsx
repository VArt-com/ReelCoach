import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold glow-text mb-3">ReelCoach</h1>
      <p className="text-white/60 mb-10">
        AI-помощник для тренеров и фитнес-коучей: подписи, хуки для Reels, разбор профиля и
        контент-план на неделю — под голос твоего аккаунта.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/login" className="btn-primary">
          Войти
        </Link>
        <Link href="/register" className="text-white/70 hover:text-white transition">
          Регистрация
        </Link>
      </div>
    </main>
  );
}
