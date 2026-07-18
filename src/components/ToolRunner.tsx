'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ToolId } from '@/lib/tools';

type Field = { name: string; label: string; placeholder: string; multiline?: boolean };

export default function ToolRunner({
  tool,
  title,
  description,
  fields,
}: {
  tool: ToolId;
  title: string;
  description: string;
  fields: Field[];
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, input: values }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === 'not_approved'
            ? 'Аккаунт ещё не подтверждён кодом приглашения.'
            : 'Не получилось сгенерировать — попробуй ещё раз.'
        );
        return;
      }
      setOutput(data.output);
    } catch {
      setError('Не получилось сгенерировать — попробуй ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/dashboard" className="text-white/50 hover:text-white text-sm">
        ← Назад
      </Link>
      <h1 className="text-2xl font-extrabold glow-text mt-3 mb-1">{title}</h1>
      <p className="text-white/50 text-sm mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm text-white/60 mb-1">{field.label}</label>
            {field.multiline ? (
              <textarea
                rows={5}
                required
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="input"
              />
            ) : (
              <input
                type="text"
                required
                placeholder={field.placeholder}
                value={values[field.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="input"
              />
            )}
          </div>
        ))}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Генерирую...' : 'Сгенерировать'}
        </button>
      </form>

      {output && (
        <div className="card p-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/50">Результат</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-400/40 rounded-full px-3 py-1.5 transition"
            >
              {copied ? 'Скопировано!' : '📋 Скопировать'}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{output}</div>
        </div>
      )}
    </main>
  );
}
