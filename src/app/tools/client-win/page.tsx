'use client';
import ToolRunner from '@/components/ToolRunner';

export default function ClientWinPage() {
  return (
    <ToolRunner
      tool="client_win"
      title="Пост о результате клиента"
      description="Кратко опиши результат — получишь готовую историю для поста."
      fields={[
        {
          name: 'result',
          label: 'Результат клиента',
          placeholder: 'Например: похудела на 6 кг за 2 месяца, стала подтягиваться 5 раз',
          multiline: true,
        },
      ]}
    />
  );
}
