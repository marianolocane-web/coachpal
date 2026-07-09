import Anthropic from '@anthropic-ai/sdk';

export const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
export const CONVERSATION_MODEL = 'claude-sonnet-5';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolDefinition<T> {
  name: string;
  description: string;
  input_schema: Anthropic.Tool.InputSchema;
  // Only used for typing the return value at call sites, never read at runtime.
  __resultType?: T;
}

/**
 * Calls Claude forcing it to use the given tool, and returns the parsed
 * `input` of the first tool_use content block. This is the structured-output
 * pattern used throughout Diario (tag suggestion/normalization, entry
 * summary, day mood pick) instead of asking for free-text JSON.
 */
export async function callClaudeWithTool<T>(opts: {
  system: string;
  messages: ClaudeMessage[];
  tool: ToolDefinition<T>;
  model?: string;
  maxTokens?: number;
}): Promise<T> {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: opts.model ?? DEFAULT_MODEL,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.system,
    messages: opts.messages,
    tools: [{ name: opts.tool.name, description: opts.tool.description, input_schema: opts.tool.input_schema }],
    tool_choice: { type: 'tool', name: opts.tool.name },
  });

  const toolUse = response.content.find((block) => block.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error(`Claude did not return a tool_use block for tool "${opts.tool.name}"`);
  }
  return toolUse.input as T;
}

/** Plain text completion, used for the conversational turns of the Diario companion. */
export async function callClaudeForText(opts: {
  system: string;
  messages: ClaudeMessage[];
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: opts.model ?? CONVERSATION_MODEL,
    max_tokens: opts.maxTokens ?? 512,
    system: opts.system,
    messages: opts.messages,
  });
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('Claude did not return a text block');
  return textBlock.text.trim();
}
