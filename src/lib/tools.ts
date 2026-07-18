// Every tool's prompt-building logic lives here, in one place, so the API
// route and the tool pages agree on exactly what fields each tool needs.

export type ToolId = 'caption' | 'hook' | 'client_win' | 'bio_audit' | 'weekly_plan';

export const TOOLS: { id: ToolId; name: string; blurb: string; href: string }[] = [
  {
    id: 'caption',
    name: 'Подпись и хэштеги',
    blurb: 'Под голос твоего аккаунта — вставь пару своих старых подписей, чтобы стиль совпал.',
    href: '/tools/captions',
  },
  {
    id: 'hook',
    name: 'Хук и сценарий Reels',
    blurb: 'Первые 3 секунды решают всё — варианты хуков + структура ролика.',
    href: '/tools/hooks',
  },
  {
    id: 'client_win',
    name: 'Пост о результате клиента',
    blurb: 'Опиши в двух словах результат — получишь цепляющую историю для поста.',
    href: '/tools/client-win',
  },
  {
    id: 'bio_audit',
    name: 'Аудит профиля',
    blurb: 'Разбор био и первого впечатления от профиля, с конкретными правками.',
    href: '/tools/bio-audit',
  },
  {
    id: 'weekly_plan',
    name: 'Контент-план на неделю',
    blurb: '7 постов разом: темы, подписи, хэштеги — под ротацию тренер/мотивация/питание.',
    href: '/tools/weekly-plan',
  },
];

type Profile = { specialty: string | null; voice_notes: string | null };

function voiceBlock(profile: Profile) {
  const parts: string[] = [];
  if (profile.specialty) parts.push(`Специализация тренера: ${profile.specialty}.`);
  if (profile.voice_notes) {
    parts.push(
      `Примеры прошлых подписей этого тренера (пиши в похожем стиле и тоне):\n${profile.voice_notes}`
    );
  }
  return parts.join('\n\n');
}

export function buildPrompt(tool: ToolId, input: Record<string, string>, profile: Profile) {
  const voice = voiceBlock(profile);
  const base =
    'Ты — ассистент по контенту для фитнес-тренеров и спортивных коучей в Instagram. Отвечай на русском (или на языке ввода пользователя), пиши живо и по делу, без канцелярита, без лишних вступлений — сразу результат.';

  switch (tool) {
    case 'caption':
      return {
        system: base,
        prompt: `${voice}\n\nНапиши 3 варианта подписи для Reels/поста на тему: "${input.topic}".\nК каждой подписи добавь 8-12 релевантных хэштегов (микс популярных и нишевых).\nФормат: пронумерованный список из 3 вариантов, каждый с подписью и хэштегами под ней.`,
      };
    case 'hook':
      return {
        system: base,
        prompt: `${voice}\n\nТема ролика: "${input.topic}".\nДай 5 разных вариантов хука (первые 3 секунды, текст на экране или первая фраза голосом) и короткую структуру ролика (хук → показ/объяснение → призыв к действию) для одного из них.`,
      };
    case 'client_win':
      return {
        system: base,
        prompt: `${voice}\n\nРезультат клиента (кратко от тренера): "${input.result}".\nНапиши цепляющий пост-историю об этом результате для Instagram — с интригой в начале, конкретикой в середине и мягким призывом к действию (записаться на тренировку/консультацию) в конце.`,
      };
    case 'bio_audit':
      return {
        system: base,
        prompt: `${voice}\n\nТекущее био профиля:\n"${input.bio}"\n\nРазбери его: что слабое, что убрать, что добавить (специализация, доверие/опыт, понятный призыв к действию). Дай готовый переписанный вариант био (макс. 150 символов, как в Instagram) в конце.`,
      };
    case 'weekly_plan':
      return {
        system: base,
        prompt: `${voice}\n\nЦель на эту неделю: "${input.goal}".\nСоставь план на 7 постов по стандартной ротации фитнес-контента (тренировка/техника, мотивация, питание, результат клиента, вовлечение/вопрос, закулисье, свободная тема). Для каждого дня: тема, короткая подпись, 5-6 хэштегов.`,
      };
  }
}
