import { AgentCardSchema } from './schema';

interface ValidationIssue {
  path: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
}

export function validateAgentCard(jsonString: string): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const infos: ValidationIssue[] = [];

  if (!jsonString.trim()) {
    return { valid: false, errors: [], warnings: [], infos: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    errors.push({
      path: '(root)',
      message: `JSON構文エラー: ${e instanceof Error ? e.message : '不明なエラー'}`,
    });
    return { valid: false, errors, warnings, infos };
  }

  const result = AgentCardSchema.safeParse(parsed);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      errors.push({ path, message: issue.message });
    }
    return { valid: false, errors, warnings, infos };
  }

  const data = result.data;

  // Warnings for best practices
  if (!data.provider?.organization) {
    warnings.push({
      path: 'provider.organization',
      message: 'プロバイダー情報が未設定です。公開時には組織名の設定を推奨します。',
    });
  }

  if (!data.documentationUrl) {
    warnings.push({
      path: 'documentationUrl',
      message: 'ドキュメントURLが未設定です。他のエージェントが連携方法を確認するために設定を推奨します。',
    });
  }

  if (!data.iconUrl) {
    warnings.push({
      path: 'iconUrl',
      message: 'アイコンURLが未設定です。UIでの識別性向上のために設定を推奨します。',
    });
  }

  for (let i = 0; i < data.skills.length; i++) {
    const skill = data.skills[i];
    if (!skill.examples || skill.examples.length === 0) {
      warnings.push({
        path: `skills[${i}].examples`,
        message: `スキル「${skill.name}」に例文がありません。他のエージェントの理解を助けるために追加を推奨します。`,
      });
    }
  }

  // Info messages
  const hasStreaming = data.capabilities.streaming === true;
  if (hasStreaming) {
    infos.push({
      path: 'capabilities.streaming',
      message: 'ストリーミング対応が有効です。リアルタイム応答が可能なエージェントとして認識されます。',
    });
  }

  const interfaceCount = data.supportedInterfaces.length;
  if (interfaceCount > 1) {
    infos.push({
      path: 'supportedInterfaces',
      message: `${interfaceCount}つのインターフェースが定義されています。クライアントは対応するバインディングを選択して接続します。`,
    });
  }

  return { valid: true, errors, warnings, infos };
}
