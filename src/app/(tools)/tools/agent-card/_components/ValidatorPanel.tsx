'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { validateAgentCard } from '@/lib/validator';
import { AlertCircle, AlertTriangle, Info, Check, Sparkles } from 'lucide-react';

const CodeEditorLazy = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-[rgba(17,24,39,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center text-[rgba(255,255,255,0.4)] text-[13px] font-mono">
      Loading editor...
    </div>
  ),
});

interface ValidatorPanelProps {
  initialJson?: string;
}

export function ValidatorPanel({ initialJson = '' }: ValidatorPanelProps): JSX.Element {
  const [jsonInput, setJsonInput] = useState(initialJson);

  const results = useMemo(() => validateAgentCard(jsonInput), [jsonInput]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sora font-bold text-[32px] text-white tracking-tight mb-2">
          Agent Card Validator
        </h2>
        <p className="text-[16px] text-[rgba(255,255,255,0.6)] mb-6">
          Paste your Agent Card JSON below to validate against A2A specifications
        </p>

        {/* Summary badges */}
        {jsonInput.trim() && (
          <div className="flex flex-wrap gap-2 mb-6">
            {results.errors.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] font-mono text-[12px] font-bold">
                <AlertCircle size={14} />
                {results.errors.length} Errors
              </span>
            )}
            {results.warnings.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-[#f59e0b] font-mono text-[12px] font-bold">
                <AlertTriangle size={14} />
                {results.warnings.length} Warning
              </span>
            )}
            {results.valid && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#10b981] font-mono text-[12px] font-bold">
                <Check size={14} />
                Valid Structure
              </span>
            )}
            {results.infos.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] text-[#60a5fa] font-mono text-[12px] font-bold">
                <Info size={14} />
                {results.infos.length} Suggestion
              </span>
            )}
          </div>
        )}

        <CodeEditorLazy
          value={jsonInput}
          onChange={setJsonInput}
        />
      </div>

      {jsonInput.trim() && (
        <div className="space-y-3">
          <h3 className="font-mono text-[13px] tracking-[1.95px] text-[rgba(255,255,255,0.5)] uppercase font-bold">
            Validation Results
          </h3>
          <p className="text-[14px] text-[rgba(255,255,255,0.4)] mb-4">
            {results.errors.length + results.warnings.length + results.infos.length + (results.valid ? 1 : 0)} issues found
          </p>

          {results.errors.map((err, i) => (
            <div key={`err-${i}`} className="flex gap-4 p-5 bg-[rgba(239,68,68,0.05)] border-2 border-[rgba(239,68,68,0.2)] rounded-2xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                <AlertCircle size={20} className="text-[#ef4444]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-lg bg-[rgba(239,68,68,0.15)] text-[#ef4444] font-mono text-[10px] font-bold uppercase tracking-wider">Error</span>
                  {err.path && (
                    <span className="font-mono text-[12px] text-[rgba(255,255,255,0.4)]">Line {i + 1}</span>
                  )}
                </div>
                {err.path && (
                  <code className="inline-block px-2 py-1 rounded-lg bg-[rgba(17,24,39,0.6)] border border-[rgba(255,255,255,0.1)] font-mono text-[12px] text-[#f59e0b] mb-1">
                    {err.path}
                  </code>
                )}
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">{err.message}</p>
              </div>
            </div>
          ))}

          {results.warnings.map((warn, i) => (
            <div key={`warn-${i}`} className="flex gap-4 p-5 bg-[rgba(245,158,11,0.05)] border-2 border-[rgba(245,158,11,0.2)] rounded-2xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                <AlertTriangle size={20} className="text-[#f59e0b]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-lg bg-[rgba(245,158,11,0.15)] text-[#f59e0b] font-mono text-[10px] font-bold uppercase tracking-wider">Warning</span>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">{warn.message}</p>
              </div>
            </div>
          ))}

          {results.valid && results.errors.length === 0 && (
            <div className="flex gap-4 p-5 bg-[rgba(16,185,129,0.05)] border-2 border-[rgba(16,185,129,0.2)] rounded-2xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
                <Check size={20} className="text-[#10b981]" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-lg bg-[rgba(16,185,129,0.15)] text-[#10b981] font-mono text-[10px] font-bold uppercase tracking-wider">Success</span>
                <p className="mt-1 text-[14px] text-[rgba(255,255,255,0.7)]">Valid A2A Agent Card structure detected</p>
              </div>
            </div>
          )}

          {results.infos.map((info, i) => (
            <div key={`info-${i}`} className="flex gap-4 p-5 bg-[rgba(59,130,246,0.05)] border-2 border-[rgba(59,130,246,0.2)] rounded-2xl">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                <Info size={20} className="text-[#60a5fa]" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-lg bg-[rgba(59,130,246,0.15)] text-[#60a5fa] font-mono text-[10px] font-bold uppercase tracking-wider">Info</span>
                <p className="mt-1 text-[14px] text-[rgba(255,255,255,0.7)]">{info.message}</p>
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              className="w-full py-4 rounded-2xl font-sora text-[16px] font-bold text-white text-center transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(170deg, #1E4D7B, #D84835)' }}
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles size={18} />
                Fix Issues Automatically
              </span>
            </button>
            <button className="w-full py-4 rounded-2xl font-sora text-[16px] font-bold text-white text-center bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.2)] backdrop-blur-xl hover:bg-[rgba(40,40,40,0.8)] transition-all duration-300">
              View Specification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
