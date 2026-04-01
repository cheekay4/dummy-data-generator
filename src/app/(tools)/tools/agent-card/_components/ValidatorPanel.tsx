'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { validateAgentCard } from '@/lib/validator';
import { AlertCircle, AlertTriangle, Info, Check } from 'lucide-react';

const CodeEditorLazy = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-kinari border border-washi rounded-[4px] flex items-center justify-center text-fude text-[11px] font-mono">
      エディタを読み込み中...
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
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-mono text-[9px] tracking-wide text-fude uppercase">
          Agent Card JSONを貼り付け
        </label>
        <CodeEditorLazy
          value={jsonInput}
          onChange={setJsonInput}
        />
      </div>

      {jsonInput.trim() && (
        <div className="space-y-2">
          <h3 className="font-sora font-semibold text-[14px] text-sumi">
            検証結果
          </h3>

          {results.valid && results.errors.length === 0 && results.warnings.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-valid/10 border border-valid/30 rounded-[4px]">
              <Check size={14} className="text-valid" />
              <span className="font-sora text-[12px] text-sumi">
                A2A v1.0準拠: 有効なAgent Card
              </span>
            </div>
          )}

          {results.errors.map((err, i) => (
            <div key={`err-${i}`} className="flex gap-2 px-3 py-2 bg-shu-light border border-shu/20 rounded-[4px]">
              <AlertCircle size={14} className="text-shu flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-[10px] text-shu">{err.path}</p>
                <p className="font-sora text-[11px] text-sumi">{err.message}</p>
              </div>
            </div>
          ))}

          {results.warnings.map((warn, i) => (
            <div key={`warn-${i}`} className="flex gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-[4px]">
              <AlertTriangle size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-[10px] text-yellow-700">{warn.path}</p>
                <p className="font-sora text-[11px] text-sumi">{warn.message}</p>
              </div>
            </div>
          ))}

          {results.infos.map((info, i) => (
            <div key={`info-${i}`} className="flex gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-[4px]">
              <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sora text-[11px] text-sumi">{info.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
