import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReelCoach — AI-контент для тренеров',
  description: 'Подписи, хуки, аудит профиля и контент-план для фитнес-тренеров в Instagram.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <footer className="py-8 text-center text-xs text-white/50">
          <nav className="flex justify-center gap-4" aria-label="Legal">
            <a href="/privacy" className="underline hover:text-white/80">Конфиденциальность</a>
            <a href="/terms" className="underline hover:text-white/80">Условия использования</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
