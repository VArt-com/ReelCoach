import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReelCoach — AI-контент для тренеров',
  description: 'Подписи, хуки, аудит профиля и контент-план для фитнес-тренеров в Instagram.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
