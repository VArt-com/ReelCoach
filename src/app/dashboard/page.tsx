import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TOOLS } from '@/lib/tools';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved, specialty')
    .eq('id', user.id)
    .single();

  if (!profile?.is_approved) redirect('/invite');

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold glow-text">ReelCoach</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/profile" className="text-white/70 hover:text-white transition">
            Профиль{!profile.specialty && ' ⚠️'}
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-white/50 hover:text-white transition">Выйти</button>
          </form>
        </div>
      </div>

      {!profile.specialty && (
        <div className="card p-4 mb-6 text-sm text-white/70">
          Заполни{' '}
          <Link href="/profile" className="text-orange-400 hover:underline">
            профиль
          </Link>{' '}
          (специализация + пара твоих старых подписей) — тогда генерация будет звучать в твоём
          стиле, а не общими фразами.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <Link key={tool.id} href={tool.href} className="card p-5 hover:border-orange-400/40 transition block">
            <div className="font-semibold mb-1">{tool.name}</div>
            <div className="text-sm text-white/50">{tool.blurb}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
