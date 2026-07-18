'use client';
import ToolRunner from '@/components/ToolRunner';

export default function BioAuditPage() {
  return (
    <ToolRunner
      tool="bio_audit"
      title="Аудит профиля"
      description="Вставь текущее био — разберём слабые места и предложим готовый вариант."
      fields={[
        { name: 'bio', label: 'Текущее био профиля', placeholder: 'Скопируй сюда своё био из Instagram', multiline: true },
      ]}
    />
  );
}
