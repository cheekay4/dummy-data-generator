'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StampOptions } from '@/lib/digital-stamp/stamp-types';

interface TextInputPanelProps {
  options: StampOptions;
  onChange: (opts: StampOptions) => void;
}

const UPPER_TEXT_OPTIONS = ['承認', '確認', '検収', '済', '受領', '決裁', 'カスタム'];

export default function TextInputPanel({ options, onChange }: TextInputPanelProps) {
  const set = (key: keyof StampOptions, value: string) => {
    onChange({ ...options, [key]: value });
  };

  const isCustomUpper = !['承認', '確認', '検収', '済', '受領', '決裁'].includes(options.upperText) && options.upperText !== '';

  return (
    <div className="space-y-3">
      {/* 姓 */}
      <div className="space-y-1">
        <Label>姓 <span className="text-red-500">*</span></Label>
        <Input value={options.sei} onChange={(e) => set('sei', e.target.value)} placeholder="例: 田中" />
      </div>

      {/* 名（フルネーム・日付印で使用） */}
      {(options.type === 'maru-full' || options.type === 'date') && (
        <div className="space-y-1">
          <Label>名</Label>
          <Input value={options.mei} onChange={(e) => set('mei', e.target.value)} placeholder="例: 太郎" />
        </div>
      )}

      {/* 会社名（角印） */}
      {options.type === 'kaku' && (
        <div className="space-y-1">
          <Label>会社名</Label>
          <Input
            value={options.companyName}
            onChange={(e) => set('companyName', e.target.value)}
            placeholder="例: 株式会社サンプル"
          />
        </div>
      )}

      {/* 上段テキスト */}
      {(options.type === 'kaku' || options.type === 'date') && (
        <div className="space-y-1">
          <Label>上段テキスト</Label>
          <Select
            value={isCustomUpper ? 'カスタム' : options.upperText}
            onValueChange={(v) => {
              if (v !== 'カスタム') set('upperText', v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UPPER_TEXT_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(isCustomUpper || options.upperText === '') && (
            <Input
              value={options.upperText}
              onChange={(e) => set('upperText', e.target.value)}
              placeholder="カスタムテキストを入力"
              className="mt-2"
            />
          )}
        </div>
      )}

      {/* 日付（日付印） */}
      {options.type === 'date' && (
        <div className="space-y-1">
          <Label>日付</Label>
          <Input
            type="date"
            value={options.date}
            onChange={(e) => set('date', e.target.value)}
          />
          <Select
            value={options.dateFormat}
            onValueChange={(v) => onChange({ ...options, dateFormat: v as StampOptions['dateFormat'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="japanese">2026.03.15（ドット区切り）</SelectItem>
              <SelectItem value="wareki">令和8年3月15日</SelectItem>
              <SelectItem value="iso">2026-03-15（ISO）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
