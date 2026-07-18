'use client';
import ToolRunner from '@/components/ToolRunner';

export default function WeeklyPlanPage() {
  return (
    <ToolRunner
      tool="weekly_plan"
      title="Контент-план на неделю"
      description="7 постов разом под фитнес-ротацию: темы, подписи, хэштеги."
      fields={[
        { name: 'goal', label: 'Цель на неделю', placeholder: 'Например: привлечь новых клиентов на групповые тренировки' },
      ]}
    />
  );
}
