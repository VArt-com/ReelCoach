import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateText(system: string, userPrompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1200,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });
  const block = message.content[0];
  return block.type === 'text' ? block.text : '';
}
