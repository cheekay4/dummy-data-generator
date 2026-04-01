export const PROTOCOL_BINDINGS = ['JSONRPC', 'GRPC', 'HTTP+JSON'] as const;
export const PROTOCOL_VERSIONS = ['0.3', '1.0'] as const;

export const INPUT_OUTPUT_MODES = [
  { value: 'text/plain', label: 'text/plain' },
  { value: 'application/json', label: 'application/json' },
  { value: 'image/*', label: 'image/*' },
  { value: 'audio/*', label: 'audio/*' },
  { value: 'video/*', label: 'video/*' },
] as const;

export const GENERATOR_STEPS = [
  { id: 'basic', label: '基本情報' },
  { id: 'provider', label: 'プロバイダー' },
  { id: 'interfaces', label: 'インターフェース' },
  { id: 'capabilities', label: '機能' },
  { id: 'io-modes', label: '入出力モード' },
  { id: 'skills', label: 'スキル' },
] as const;
