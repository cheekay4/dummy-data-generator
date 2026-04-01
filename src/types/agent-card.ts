export type { AgentCard, AgentSkill, AgentInterface, AgentCapabilities, AgentProvider } from '@/lib/schema';

export type GeneratorStep = 'basic' | 'provider' | 'interfaces' | 'capabilities' | 'io-modes' | 'skills';

export type ViewMode = 'gui' | 'code';

export type TriState = true | false | null;
