export type LegalBlock = { h: string; p?: string[]; ul?: string[] };

const CONTACT = [
  { label: 'org-va.com/contact', href: 'https://org-va.com/contact.html' },
  { label: 'WhatsApp', href: 'https://wa.me/972533213698' },
];

export function LegalPage({ title, updated, blocks }: { title: string; updated: string; blocks: LegalBlock[] }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 text-white/80">
      <h1 className="text-2xl font-bold mb-1 glow-text">{title}</h1>
      <p className="text-xs text-white/50 mb-8">{updated}</p>
      {blocks.map((b) => (
        <section key={b.h} className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">{b.h}</h2>
          {b.p?.map((t, i) => (
            <p key={i} className="text-sm leading-relaxed mb-2">{t}</p>
          ))}
          {b.ul && (
            <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed">
              {b.ul.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </section>
      ))}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Контакты</h2>
        <p className="text-sm mb-2">По вопросам о данных, жалобам и запросам на удаление:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {CONTACT.map((c) => (
            <li key={c.href}><a className="underline" href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a></li>
          ))}
        </ul>
      </section>
      <nav className="text-xs text-white/50 flex gap-4" aria-label="Legal">
        <a className="underline" href="/privacy">Конфиденциальность</a>
        <a className="underline" href="/terms">Условия</a>
      </nav>
    </main>
  );
}
