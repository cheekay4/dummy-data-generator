import Anthropic from "@anthropic-ai/sdk";

/** LLM 呼び出しの抽象化。テストでは MockTransport に差し替える */
export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LlmRequest {
  model: string;
  system: string;
  messages: LlmMessage[];
  maxTokens: number;
  /** Sonnet 5 は thinking がデフォルトONのため、原価管理が必要な経路では明示的に無効化する */
  disableThinking?: boolean;
}

export interface LlmUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface LlmResult {
  text: string;
  usage: LlmUsage;
}

export interface LlmTransport {
  complete(request: LlmRequest): Promise<LlmResult>;
}

export class AnthropicTransport implements LlmTransport {
  private readonly client: Anthropic;

  constructor(client?: Anthropic) {
    this.client = client ?? new Anthropic();
  }

  async complete(request: LlmRequest): Promise<LlmResult> {
    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens,
      // システムプロンプトは全ターン共通なのでキャッシュ指定（モデル最小プレフィックス未満なら無害に無視される）
      system: [
        {
          type: "text",
          text: request.system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
      ...(request.disableThinking === true ? { thinking: { type: "disabled" as const } } : {}),
    });
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    return {
      text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }
}

/** テスト用: 固定応答を順番に返す */
export class MockTransport implements LlmTransport {
  public readonly requests: LlmRequest[] = [];
  private readonly responses: string[];
  private index = 0;

  constructor(responses: string[]) {
    this.responses = responses;
  }

  complete(request: LlmRequest): Promise<LlmResult> {
    this.requests.push(request);
    const text = this.responses[Math.min(this.index, this.responses.length - 1)] ?? "";
    this.index += 1;
    return Promise.resolve({
      text,
      usage: { inputTokens: 0, outputTokens: 0 },
    });
  }
}
