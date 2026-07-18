import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateText } from '@/lib/anthropic';
import { buildPrompt, type ToolId } from '@/lib/tools';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved, specialty, voice_notes')
    .eq('id', user.id)
    .single();

  if (!profile?.is_approved) {
    return NextResponse.json({ error: 'not_approved' }, { status: 403 });
  }

  const body = await request.json();
  const tool = body.tool as ToolId;
  const input = body.input as Record<string, string>;

  const validTools: ToolId[] = ['caption', 'hook', 'client_win', 'bio_audit', 'weekly_plan'];
  if (!validTools.includes(tool)) {
    return NextResponse.json({ error: 'invalid_tool' }, { status: 400 });
  }

  const { system, prompt } = buildPrompt(tool, input, profile);

  let output: string;
  try {
    output = await generateText(system, prompt);
  } catch (err) {
    console.error('Anthropic generation failed', err);
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  await supabase.from('generations').insert({ user_id: user.id, tool, input, output });

  return NextResponse.json({ output });
}
