'use client';
import ToolRunner from '@/components/ToolRunner';

export default function HooksPage() {
  return (
    <ToolRunner
      tool="hook"
      title="Хук и сценарий Reels"
      description="5 вариантов первых 3 секунд + структура ролика."
      fields={[
        { name: 'topic', label: 'Тема ролика', placeholder: 'Например: 3 ошибки в приседаниях' },
      ]}
    />
  );
}
