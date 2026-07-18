'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [specialty, setSpecialty] = useState('');
  const [voiceNotes, setVoiceNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('specialty, voice_notes')
        .eq('id', user.id)
        .single();
      setSpecialty(data?.specialty ?? '');
      setVoiceNotes(data?.voice_notes ?? '');
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ specialty, voice_notes: voiceNotes })
      .eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <main className="max-w-lg mx-auto px-4 py-10 text-white/50">…</main>;

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <Link href="/dashboard" className="text-white/50 hover:text-white text-sm">
        ← Назад
      </Link>
      <h1 className="text-2xl font-extrabold glow-text mt-3 mb-6">Профиль</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Специализация</label>
          <input
            type="text"
            placeholder="Например: силовые тренировки, йога, бег"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">
            Примеры твоих старых подписей (вставь 2-3, через пустую строку)
          </label>
          <textarea
            rows={8}
            placeholder="Вставь сюда пару подписей из своих реальных постов — AI подстроится под твой стиль"
            value={voiceNotes}
            onChange={(e) => setVoiceNotes(e.target.value)}
            className="input"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Сохраняю...' : saved ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </form>
    </main>
  );
}
