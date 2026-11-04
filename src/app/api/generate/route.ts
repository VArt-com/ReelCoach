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

  let body: { tool?: unknown; input?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const tool = body.tool as ToolId;

  // Validate and bound the input: plain object, string values only, capped
  // sizes (protects against abuse and runaway AI costs).
  const MAX_FIELDS = 12;
  const MAX_FIELD_LENGTH = 3000;
  const MAX_TOTAL_LENGTH = 8000;
  if (!body.input || typeof body.input !== 'object' || Array.isArray(body.input)) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }
  const entries = Object.entries(body.input as Record<string, unknown>);
  if (entries.length > MAX_FIELDS) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }
  const input: Record<string, string> = {};
  let total = 0;
  for (const [key, value] of entries) {
    if (typeof value !== 'string' || value.length > MAX_FIELD_LENGTH || key.length > 60) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }
    total += value.length;
    input[key] = value;
  }
  if (total > MAX_TOTAL_LENGTH) {
    return NextResponse.json({ error: 'input_too_long' }, { status: 413 });
  }

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
