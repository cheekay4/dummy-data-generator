'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ERAS, getEraStartYear, getEraMaxYear } from '@/lib/wareki/eras';
import {
  warekiToSeireki,
  unixTimestampToDate,
  iso8601ToDate,
  buildConversionResult,
  type ConversionResult,
} from '@/lib/wareki/converter';

type TabId = 'wareki' | 'seireki' | 'unix' | 'iso';

interface ConversionTabsProps {
  onResult: (result: ConversionResult) => void;
  onError: (error: string) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'wareki', label: '和暦から変換' },
  { id: 'seireki', label: '西暦から変換' },
  { id: 'unix', label: 'UNIXタイムスタンプ' },
  { id: 'iso', label: 'ISO 8601' },
];

// Shared select styles
const selectCls =
  'px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring';
const inputCls =
  'px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring w-full';

// Days in month (accounts for leap years)
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// ── Wareki tab ─────────────────────────────────────────────────────────────

function WarekiTab({
  onResult,
  onError,
}: {
  onResult: (r: ConversionResult) => void;
  onError: (e: string) => void;
}) {
  const [eraName, setEraName] = useState('令和');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const era = ERAS.find((e) => e.name === eraName)!;
  const maxEraYear = getEraMaxYear(era);

  const selectedYear = parseInt(year, 10) || 1;
  const selectedMonth = parseInt(month, 10) || 0;
  const westernYearEst = getEraStartYear(era) + selectedYear - 1;
  const maxDays = selectedMonth ? daysInMonth(westernYearEst, selectedMonth) : 31;

  const handleConvert = () => {
    const y = parseInt(year, 10);
    if (isNaN(y) || y < 1) {
      onError(`${eraName}の年を正しく入力してください`);
      return;
    }

    const m = month ? parseInt(month, 10) : undefined;
    const d = day ? parseInt(day, 10) : undefined;

    const result = warekiToSeireki(eraName, y, m, d);
    if (!result) {
      onError(
        `入力した日付は${eraName}の有効範囲外です。` +
          (eraName === '昭和' && y === 64
            ? '昭和64年は1月1日〜1月7日のみ有効です。'
            : eraName === '平成' && y === 31
            ? '平成31年は1月1日〜4月30日のみ有効です。'
            : ''),
      );
      return;
    }

    onResult(buildConversionResult(result.year, result.month ?? null, result.day ?? null));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">元号</label>
          <select
            value={eraName}
            onChange={(e) => {
              setEraName(e.target.value);
              setYear('');
              setMonth('');
              setDay('');
            }}
            className={selectCls}
          >
            {ERAS.map((e) => (
              <option key={e.name} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            年（1〜{maxEraYear}）
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setDay('');
            }}
            placeholder="例: 6"
            min={1}
            max={maxEraYear}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">月（任意）</label>
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setDay('');
            }}
            className={selectCls}
          >
            <option value="">--</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">日（任意）</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={selectCls}
            disabled={!month}
          >
            <option value="">--</option>
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button onClick={handleConvert}>変換</Button>
    </div>
  );
}

// ── Seireki tab ────────────────────────────────────────────────────────────

function SeirekiTab({
  onResult,
  onError,
}: {
  onResult: (r: ConversionResult) => void;
  onError: (e: string) => void;
}) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const selectedYear = parseInt(year, 10) || new Date().getFullYear();
  const selectedMonth = parseInt(month, 10) || 0;
  const maxDays = selectedMonth ? daysInMonth(selectedYear, selectedMonth) : 31;

  const handleConvert = () => {
    const y = parseInt(year, 10);
    if (isNaN(y) || y < 1868 || y > 2100) {
      onError('1868〜2100の範囲で西暦年を入力してください');
      return;
    }

    const m = month ? parseInt(month, 10) : undefined;
    const d = day ? parseInt(day, 10) : undefined;

    if (m && d) {
      const testDate = new Date(y, m - 1, d);
      if (testDate.getMonth() !== m - 1) {
        onError(`${y}年${m}月に${d}日は存在しません（閏年を確認してください）`);
        return;
      }
    }

    onResult(buildConversionResult(y, m ?? null, d ?? null));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">年（1868〜2100）</label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setDay('');
            }}
            placeholder="例: 2026"
            min={1868}
            max={2100}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">月（任意）</label>
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setDay('');
            }}
            className={selectCls}
          >
            <option value="">--</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">日（任意）</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={selectCls}
            disabled={!month}
          >
            <option value="">--</option>
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button onClick={handleConvert}>変換</Button>
    </div>
  );
}

// ── Unix tab ───────────────────────────────────────────────────────────────

function UnixTab({
  onResult,
  onError,
}: {
  onResult: (r: ConversionResult) => void;
  onError: (e: string) => void;
}) {
  const [value, setValue] = useState('');

  const handleConvert = () => {
    const ts = parseInt(value.trim(), 10);
    if (isNaN(ts)) {
      onError('数値を入力してください（例: 1771426800 または 1771426800000）');
      return;
    }
    const parts = unixTimestampToDate(ts);
    onResult(
      buildConversionResult(
        parts.year,
        parts.month,
        parts.day,
        parts.hours,
        parts.minutes,
        parts.seconds,
      ),
    );
  };

  const handleNow = () => {
    setValue(String(Math.floor(Date.now() / 1000)));
  };

  return (
    <div className="space-y-3">
      <div className="max-w-sm">
        <label className="block text-xs text-muted-foreground mb-1">
          UNIXタイムスタンプ
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="例: 1771426800"
          className={inputCls}
        />
        <p className="text-xs text-muted-foreground mt-1">
          秒（10桁）またはミリ秒（13桁）を入力
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleConvert}>変換</Button>
        <Button variant="outline" size="sm" onClick={handleNow}>
          現在時刻を入力
        </Button>
      </div>
    </div>
  );
}

// ── ISO 8601 tab ───────────────────────────────────────────────────────────

function IsoTab({
  onResult,
  onError,
}: {
  onResult: (r: ConversionResult) => void;
  onError: (e: string) => void;
}) {
  const [value, setValue] = useState('');

  const handleConvert = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      onError('ISO 8601形式の日付を入力してください');
      return;
    }
    const parts = iso8601ToDate(trimmed);
    if (!parts) {
      onError(
        '解析できませんでした。例: 2026-02-21 / 2026-02-21T09:30:00+09:00 / 2026-02-21T00:30:00Z',
      );
      return;
    }
    onResult(
      buildConversionResult(
        parts.year,
        parts.month,
        parts.day,
        parts.hasTime ? parts.hours : undefined,
        parts.hasTime ? parts.minutes : undefined,
        parts.hasTime ? parts.seconds : undefined,
      ),
    );
  };

  return (
    <div className="space-y-3">
      <div className="max-w-sm">
        <label className="block text-xs text-muted-foreground mb-1">ISO 8601</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="例: 2026-02-21T09:30:00+09:00"
          className={inputCls}
        />
        <p className="text-xs text-muted-foreground mt-1">
          タイムゾーン付き・なし両方対応。タイムゾーン付きはJSTに変換して表示します。
        </p>
      </div>
      <Button onClick={handleConvert}>変換</Button>
    </div>
  );
}

// ── Main ConversionTabs ────────────────────────────────────────────────────

export function ConversionTabs({ onResult, onError }: ConversionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('wareki');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-4 border-b pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'wareki' && <WarekiTab onResult={onResult} onError={onError} />}
      {activeTab === 'seireki' && <SeirekiTab onResult={onResult} onError={onError} />}
      {activeTab === 'unix' && <UnixTab onResult={onResult} onError={onError} />}
      {activeTab === 'iso' && <IsoTab onResult={onResult} onError={onError} />}
    </div>
  );
}
