'use client';
import ToolRunner from '@/components/ToolRunner';

export default function CaptionsPage() {
  return (
    <ToolRunner
      tool="caption"
      title="Подпись и хэштеги"
      description="Опиши тему поста/ролика — получишь 3 варианта подписи с хэштегами в твоём стиле."
      fields={[
        { name: 'topic', label: 'Тема поста', placeholder: 'Например: тренировка ног дома без инвентаря' },
      ]}
    />
  );
}
