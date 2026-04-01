'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgentCardSchema } from '@/lib/schema';
import type { AgentCard, GeneratorStep, ViewMode } from '@/types/agent-card';
import { GENERATOR_STEPS } from '@/lib/constants';
import { presets } from '@/lib/presets';
import { formToAgentCard } from '@/lib/generator';
import { useDebounce } from '@/hooks/useDebounce';
import { StepNav } from './StepNav';
import { GeneratorForm } from './GeneratorForm';
import { ValidatorPanel } from './ValidatorPanel';
import { JsonPreview } from './JsonPreview';
import { ExportActions } from './ExportActions';
import { PresetSelector } from './PresetSelector';
import { Tabs } from '@/components/ui/Tabs';
import { Check, AlertCircle } from 'lucide-react';

const CodeEditorLazy = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-kinari border border-washi rounded-[4px] flex items-center justify-center text-fude text-[11px] font-mono">
      エディタを読み込み中...
    </div>
  ),
});

const defaultValues: AgentCard = {
  ...presets[0].value!,
};

export function AgentCardWorkspace(): JSX.Element {
  const [activeStep, setActiveStep] = useState<GeneratorStep>('basic');
  const [activeView, setActiveView] = useState<'generator' | 'validator'>('generator');
  const [viewMode, setViewMode] = useState<ViewMode>('gui');
  const [mobileTab, setMobileTab] = useState<string>('form');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod v4 + @hookform/resolvers v5 resolver type mismatch workaround
  const form = useForm<AgentCard, unknown, AgentCard>({
    resolver: zodResolver(AgentCardSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const watchedValues = useWatch({ control: form.control });
  const debouncedValues = useDebounce(watchedValues, 300);

  const jsonOutput = useMemo((): string => {
    try {
      const card = formToAgentCard(debouncedValues as AgentCard);
      return JSON.stringify(card, null, 2);
    } catch {
      return '{}';
    }
  }, [debouncedValues]);

  const validationResult = useMemo(() => {
    return AgentCardSchema.safeParse(debouncedValues);
  }, [debouncedValues]);

  const isValid = validationResult.success;

  const handlePresetSelect = (presetId: string): void => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset?.value) {
      form.reset(preset.value);
    } else {
      form.reset({
        name: '',
        description: '',
        version: '1.0.0',
        supportedInterfaces: [{ url: '', protocolBinding: 'JSONRPC', protocolVersion: '1.0', tenant: '' }],
        capabilities: { streaming: null, pushNotifications: null, extendedAgentCard: null, extensions: [] },
        defaultInputModes: ['text/plain'],
        defaultOutputModes: ['text/plain'],
        skills: [{ id: '', name: '', description: '', tags: [], examples: [] }],
        provider: { organization: '', url: '' },
        documentationUrl: '',
        iconUrl: '',
      });
    }
    setActiveStep('basic');
  };

  const handleCodeChange = (newJson: string): void => {
    try {
      const parsed: unknown = JSON.parse(newJson);
      const result = AgentCardSchema.safeParse(parsed);
      if (result.success) {
        form.reset(result.data);
      }
    } catch {
      // Invalid JSON, ignore
    }
  };

  const handleValidateJson = (): void => {
    setActiveView('validator');
  };

  const completedSteps = useMemo((): Set<GeneratorStep> => {
    const completed = new Set<GeneratorStep>();
    const v = debouncedValues as AgentCard;
    if (!v) return completed;
    if (v.name && v.description && v.version) completed.add('basic');
    if (v.supportedInterfaces?.length > 0 && v.supportedInterfaces[0]?.url) completed.add('interfaces');
    if (v.defaultInputModes?.length > 0 && v.defaultOutputModes?.length > 0) completed.add('io-modes');
    if (v.skills?.length > 0 && v.skills[0]?.id) completed.add('skills');
    // provider and capabilities are optional, always "complete"
    completed.add('provider');
    completed.add('capabilities');
    return completed;
  }, [debouncedValues]);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Desktop layout */}
      <div className="hidden lg:flex">
        {/* Left nav - 130px */}
        <div className="w-[130px] flex-shrink-0 border-r border-washi bg-kinari-warm">
          <div className="sticky top-0 pt-4 pb-4">
            <div className="px-3 mb-3">
              <span className="font-mono text-[8px] tracking-wide text-fude-muted uppercase">
                generator
              </span>
            </div>
            <StepNav
              steps={GENERATOR_STEPS}
              activeStep={activeView === 'generator' ? activeStep : ''}
              completedSteps={completedSteps}
              onStepClick={(step) => {
                setActiveView('generator');
                setActiveStep(step as GeneratorStep);
              }}
            />
            <div className="mt-4 px-3">
              <div className="border-t border-washi pt-3">
                <span className="font-mono text-[8px] tracking-wide text-fude-muted uppercase">
                  validator
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveView('validator')}
              className={`
                w-full text-left px-3 py-1.5
                font-sora text-[11px]
                transition-colors duration-150
                ${activeView === 'validator'
                  ? 'bg-kinari-surface border-r-2 border-shu text-sumi font-medium'
                  : 'text-fude hover:text-sumi hover:bg-washi-light'
                }
              `}
            >
              JSON検証
            </button>
          </div>
        </div>

        {/* Center - flex 1 */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-washi">
            <div className="flex items-center gap-2">
              {activeView === 'generator' && (
                <>
                  <button
                    onClick={() => setViewMode('gui')}
                    className={`px-2 py-0.5 font-sora text-[11px] rounded-[4px] transition-colors ${viewMode === 'gui' ? 'bg-sumi text-kinari' : 'text-fude hover:text-sumi'}`}
                  >
                    GUI
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-2 py-0.5 font-mono text-[11px] rounded-[4px] transition-colors ${viewMode === 'code' ? 'bg-sumi text-kinari' : 'text-fude hover:text-sumi'}`}
                  >
                    Code
                  </button>
                </>
              )}
            </div>
            <ExportActions json={jsonOutput} />
          </div>

          {/* Content */}
          <div className="p-4">
            {activeView === 'generator' && viewMode === 'gui' && (
              <>
                {activeStep === 'basic' && (
                  <PresetSelector
                    onSelect={handlePresetSelect}
                    activePreset={null}
                  />
                )}
                <GeneratorForm
                  form={form}
                  activeStep={activeStep}
                  onStepChange={setActiveStep}
                />
              </>
            )}
            {activeView === 'generator' && viewMode === 'code' && (
              <CodeEditorLazy
                value={jsonOutput}
                onChange={handleCodeChange}
              />
            )}
            {activeView === 'validator' && (
              <ValidatorPanel initialJson={jsonOutput} />
            )}
          </div>
        </div>

        {/* Right panel - 200px */}
        <div className="w-[200px] flex-shrink-0 bg-sumi border-l border-sumi-light">
          <div className="sticky top-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-sumi-light">
              <span className="font-mono text-[10px] text-fude-light">
                agent-card.json
              </span>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-valid' : 'bg-invalid'}`} />
                <span className="font-mono text-[9px] text-fude-light">live</span>
              </div>
            </div>
            <JsonPreview json={jsonOutput} />
            <div className="px-3 py-2 border-t border-sumi-light">
              <div className="flex items-center gap-1.5">
                {isValid ? (
                  <>
                    <Check size={11} className="text-valid" />
                    <span className="font-mono text-[9px] text-valid">valid</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={11} className="text-invalid" />
                    <span className="font-mono text-[9px] text-invalid">
                      {!validationResult.success
                        ? `${validationResult.error.issues.length} errors`
                        : 'invalid'}
                    </span>
                  </>
                )}
              </div>
              {activeView === 'generator' && (
                <button
                  onClick={handleValidateJson}
                  className="mt-2 w-full text-left font-sora text-[10px] text-fude hover:text-kinari transition-colors"
                >
                  このJSONを検証 &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="px-4 py-2 border-b border-washi">
          <Tabs
            tabs={[
              { id: 'form', label: 'フォーム' },
              { id: 'json', label: 'JSON' },
              { id: 'validate', label: '検証' },
            ]}
            activeTab={mobileTab}
            onTabChange={setMobileTab}
          />
        </div>
        <div className="p-4">
          {mobileTab === 'form' && (
            <>
              <PresetSelector onSelect={handlePresetSelect} activePreset={null} />
              <div className="mt-3 flex gap-1 overflow-x-auto pb-2">
                {GENERATOR_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id as GeneratorStep)}
                    className={`
                      flex-shrink-0 px-2 py-1 font-sora text-[10px] rounded-[4px] border
                      ${activeStep === step.id
                        ? 'bg-sumi text-kinari border-sumi'
                        : 'text-fude border-washi hover:bg-washi-light'}
                    `}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
              <GeneratorForm form={form} activeStep={activeStep} onStepChange={setActiveStep} />
            </>
          )}
          {mobileTab === 'json' && (
            <div className="bg-sumi rounded-[6px] overflow-hidden">
              <div className="px-3 py-2 border-b border-sumi-light flex items-center justify-between">
                <span className="font-mono text-[10px] text-fude-light">agent-card.json</span>
                <ExportActions json={jsonOutput} />
              </div>
              <JsonPreview json={jsonOutput} />
            </div>
          )}
          {mobileTab === 'validate' && (
            <ValidatorPanel initialJson={jsonOutput} />
          )}
        </div>
      </div>

      {/* Static content section below */}
      <StaticGuide />
    </div>
  );
}

function StaticGuide(): JSX.Element {
  return (
    <div className="border-t border-washi bg-kinari-warm">
      <div className="max-w-[800px] mx-auto px-4 py-12">
        <h2 className="font-sora font-semibold text-[18px] text-sumi tracking-tight">
          エージェントカード（Agent Card）とは
        </h2>
        <p className="mt-3 text-[13px] text-fude leading-relaxed">
          Agent CardはA2A（Agent-to-Agent）プロトコル v1.0の中核要素です。
          エージェントの能力・接続先・認証情報をJSON形式で宣言する「エージェントの名刺」として機能します。
          <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">
            /.well-known/agent-card.json
          </code>
          に配置してWebで公開します。
        </p>

        <h3 className="mt-8 font-sora font-semibold text-[16px] text-sumi">設置方法</h3>
        <ol className="mt-3 space-y-3 text-[13px] text-fude">
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-sumi text-kinari text-[10px] font-mono rounded-[4px]">1</span>
            <span>上のジェネレーターでAgent Cardを作成し、JSONファイルをダウンロード</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-sumi text-kinari text-[10px] font-mono rounded-[4px]">2</span>
            <span>
              Webサーバーの
              <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">/.well-known/</code>
              ディレクトリに
              <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">agent-card.json</code>
              を配置
            </span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-sumi text-kinari text-[10px] font-mono rounded-[4px]">3</span>
            <span>Content-Typeを<code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">application/json</code>で配信されるよう設定</span>
          </li>
        </ol>

        <h3 className="mt-8 font-sora font-semibold text-[16px] text-sumi">よくある質問</h3>
        <div className="mt-3 space-y-4">
          {[
            {
              q: 'データは外部に送信されますか？',
              a: 'いいえ。すべての処理はブラウザ内で完結します。入力データがサーバーに送信されることは一切ありません。',
            },
            {
              q: 'A2Aプロトコルとは？',
              a: 'A2A（Agent-to-Agent）はGoogleが提唱するオープンプロトコルで、AIエージェント同士が互いの能力を発見し、タスクを委譲するための標準規格です。',
            },
            {
              q: 'Agent Cardは必須ですか？',
              a: 'A2Aプロトコルに参加するエージェントはAgent Cardの公開が必須です。他のエージェントがあなたのエージェントを発見・連携するための情報源になります。',
            },
            {
              q: 'MCP（Model Context Protocol）との違いは？',
              a: 'MCPはLLMとツール/データソースの接続に特化したプロトコルです。A2Aはエージェント間の対等な連携に焦点を当てており、相互補完的な関係にあります。',
            },
            {
              q: '対応しているバージョンは？',
              a: 'A2Aプロトコル v1.0に準拠しています。プロトコルバージョン0.3との互換性も維持しています。',
            },
          ].map((faq, i) => (
            <details key={i} className="group border border-washi rounded-[4px]">
              <summary className="px-3 py-2 font-sora text-[12px] text-sumi cursor-pointer hover:bg-washi-light transition-colors">
                {faq.q}
              </summary>
              <p className="px-3 pb-3 text-[12px] text-fude leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
