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
    <div className="h-[400px] bg-[rgba(17,24,39,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center text-[rgba(255,255,255,0.4)] text-[13px] font-mono">
      Loading editor...
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
    completed.add('provider');
    completed.add('capabilities');
    return completed;
  }, [debouncedValues]);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Desktop layout */}
      <div className="hidden lg:flex">
        {/* Left nav - 320px */}
        <div className="w-[320px] flex-shrink-0 border-r border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.95)]">
          <div className="sticky top-0 flex flex-col h-screen">
            <div className="flex-1 pt-8 px-8">
              <div className="mb-6">
                <span className="font-mono text-[13px] tracking-[1.95px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                  Generation Steps
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
              <div className="mt-6">
                <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                  <span className="font-mono text-[13px] tracking-[1.95px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                    Validator
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveView('validator')}
                className={`
                  w-full text-left px-4 py-3 mt-2
                  rounded-[14px] border
                  font-sora text-[14px] font-semibold
                  transition-all duration-300
                  ${activeView === 'validator'
                    ? 'bg-[rgba(139,92,246,0.15)] border-[rgba(139,92,246,0.3)] text-white shadow-lg'
                    : 'border-transparent text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.03)]'
                  }
                `}
              >
                JSON検証
              </button>
            </div>

            {/* Progress bar */}
            <div className="border-t border-[rgba(255,255,255,0.1)] px-8 py-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[12px] font-semibold text-[rgba(255,255,255,0.5)]">
                  Overall Progress
                </span>
                <span className="font-mono text-[14px] font-bold text-white">
                  {Math.round((completedSteps.size / GENERATOR_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="h-2.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1E4D7B] to-[#D84835] transition-all duration-500"
                  style={{ width: `${(completedSteps.size / GENERATOR_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center - flex 1 */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3">
              {activeView === 'generator' && (
                <>
                  <button
                    onClick={() => setViewMode('gui')}
                    className={`px-4 py-2 font-sora text-[13px] font-semibold rounded-xl transition-all duration-300 ${viewMode === 'gui' ? 'bg-gradient-to-r from-[#1E4D7B] to-[#D84835] text-white' : 'text-[rgba(255,255,255,0.5)] hover:text-white'}`}
                  >
                    GUI
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-4 py-2 font-mono text-[13px] font-semibold rounded-xl transition-all duration-300 ${viewMode === 'code' ? 'bg-gradient-to-r from-[#1E4D7B] to-[#D84835] text-white' : 'text-[rgba(255,255,255,0.5)] hover:text-white'}`}
                  >
                    Code
                  </button>
                </>
              )}
            </div>
            <ExportActions json={jsonOutput} />
          </div>

          {/* Content */}
          <div className="p-6 md:px-16 lg:px-[60px] py-12">
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

        {/* Right panel - 480px */}
        <div className="w-[480px] flex-shrink-0 bg-[rgba(10,10,10,0.95)] border-l border-[rgba(255,255,255,0.1)]">
          <div className="sticky top-0 flex flex-col h-screen">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)]">
              <span className="font-mono text-[13px] tracking-[1.95px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
                JSON Preview
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D84835] opacity-80 animate-pulse" />
                <span className="font-mono text-[11px] text-[rgba(255,255,255,0.4)]">Live</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <JsonPreview json={jsonOutput} />
            </div>
            <div className="px-6 py-5 border-t border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-2 mb-3">
                {isValid ? (
                  <>
                    <Check size={14} className="text-valid" />
                    <span className="font-mono text-[12px] text-valid font-semibold">Valid A2A Agent Card</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-invalid" />
                    <span className="font-mono text-[12px] text-invalid font-semibold">
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
                  className="w-full py-3.5 rounded-2xl font-sora text-[15px] font-bold text-white text-center transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(170deg, #1E4D7B, #D84835)' }}
                >
                  Download JSON
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.1)]">
          <Tabs
            tabs={[
              { id: 'form', label: 'Form' },
              { id: 'json', label: 'JSON' },
              { id: 'validate', label: 'Validate' },
            ]}
            activeTab={mobileTab}
            onTabChange={setMobileTab}
          />
        </div>
        <div className="p-4">
          {mobileTab === 'form' && (
            <>
              <PresetSelector onSelect={handlePresetSelect} activePreset={null} />
              <div className="mt-4 flex gap-2 overflow-x-auto pb-3">
                {GENERATOR_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id as GeneratorStep)}
                    className={`
                      flex-shrink-0 px-4 py-2 font-sora text-[12px] font-semibold rounded-xl border-2 transition-all duration-300
                      ${activeStep === step.id
                        ? 'bg-gradient-to-r from-[#1E4D7B] to-[#D84835] text-white border-transparent'
                        : 'text-[rgba(255,255,255,0.5)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'}
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[13px] text-[rgba(255,255,255,0.5)]">agent-card.json</span>
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
    <div className="border-t border-[rgba(255,255,255,0.1)]">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-16">
        <h2 className="font-sora font-bold text-[32px] text-white tracking-tight">
          エージェントカード（Agent Card）とは
        </h2>
        <p className="mt-4 text-[16px] text-[rgba(255,255,255,0.6)] leading-[1.8]">
          Agent CardはA2A（Agent-to-Agent）プロトコル v1.0の中核要素です。
          エージェントの能力・接続先・認証情報をJSON形式で宣言する「エージェントの名刺」として機能します。
          <code className="font-mono text-[13px] bg-[rgba(17,24,39,0.6)] px-2 py-0.5 rounded-lg border border-[rgba(255,255,255,0.1)]">
            /.well-known/agent-card.json
          </code>
          に配置してWebで公開します。
        </p>

        <h3 className="mt-12 font-sora font-bold text-[24px] text-white">設置方法</h3>
        <ol className="mt-4 space-y-4 text-[16px] text-[rgba(255,255,255,0.6)]">
          {['上のジェネレーターでAgent Cardを作成し、JSONファイルをダウンロード',
            'Webサーバーの /.well-known/ ディレクトリに agent-card.json を配置',
            'Content-Typeを application/json で配信されるよう設定'
          ].map((text, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-[14px] font-mono text-[14px] font-bold text-white bg-gradient-to-br from-[#1E4D7B] to-[#D84835]">
                {i + 1}
              </span>
              <span className="pt-1">{text}</span>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 font-sora font-bold text-[24px] text-white">よくある質問</h3>
        <div className="mt-4 space-y-3">
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
            <details key={i} className="group bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
              <summary className="px-6 py-4 font-sora text-[15px] font-semibold text-white cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                {faq.q}
              </summary>
              <p className="px-6 pb-5 text-[15px] text-[rgba(255,255,255,0.6)] leading-[1.8]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
