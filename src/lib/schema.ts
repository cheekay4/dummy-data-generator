import { z } from 'zod';

const AgentProviderSchema = z.object({
  organization: z.string().min(1, '組織名は必須です'),
  url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
});

const AgentInterfaceSchema = z.object({
  url: z.string().url('有効なURLを入力してください'),
  protocolBinding: z.enum(['JSONRPC', 'GRPC', 'HTTP+JSON'], {
    error: '選択してください',
  }),
  protocolVersion: z.enum(['0.3', '1.0'], {
    error: '選択してください',
  }),
  tenant: z.string().optional().or(z.literal('')),
});

const AgentExtensionSchema = z.object({
  uri: z.string().url('有効なURIを入力してください'),
  description: z.string().optional().or(z.literal('')),
  required: z.boolean().default(false),
});

const AgentCapabilitiesSchema = z.object({
  streaming: z.boolean().nullable().default(null),
  pushNotifications: z.boolean().nullable().default(null),
  extendedAgentCard: z.boolean().nullable().default(null),
  extensions: z.array(AgentExtensionSchema).optional().default([]),
});

const AgentSkillSchema = z.object({
  id: z.string().min(1, 'スキルIDは必須です'),
  name: z.string().min(1, 'スキル名は必須です'),
  description: z.string().min(1, 'スキルの説明は必須です'),
  tags: z.array(z.string()).min(1, 'タグを1つ以上入力してください'),
  examples: z.array(z.string()).optional().default([]),
  inputModes: z.array(z.string()).optional(),
  outputModes: z.array(z.string()).optional(),
});

export const AgentCardSchema = z.object({
  name: z.string().min(1, 'エージェント名は必須です'),
  description: z.string().min(1, '説明は必須です'),
  version: z.string().regex(
    /^\d+\.\d+\.\d+$/,
    'セマンティックバージョニング形式（例: 1.0.0）で入力してください'
  ),
  supportedInterfaces: z.array(AgentInterfaceSchema).min(1, 'インターフェースを1つ以上定義してください'),
  capabilities: AgentCapabilitiesSchema,
  defaultInputModes: z.array(z.string()).min(1, '入力モードを1つ以上選択してください'),
  defaultOutputModes: z.array(z.string()).min(1, '出力モードを1つ以上選択してください'),
  skills: z.array(AgentSkillSchema).min(1, 'スキルを1つ以上定義してください'),
  provider: AgentProviderSchema.optional(),
  documentationUrl: z.string().url().optional().or(z.literal('')),
  iconUrl: z.string().url().optional().or(z.literal('')),
});

export type AgentCard = z.infer<typeof AgentCardSchema>;
export type AgentSkill = z.infer<typeof AgentSkillSchema>;
export type AgentInterface = z.infer<typeof AgentInterfaceSchema>;
export type AgentCapabilities = z.infer<typeof AgentCapabilitiesSchema>;
export type AgentProvider = z.infer<typeof AgentProviderSchema>;

export { AgentSkillSchema, AgentInterfaceSchema, AgentCapabilitiesSchema, AgentProviderSchema };
