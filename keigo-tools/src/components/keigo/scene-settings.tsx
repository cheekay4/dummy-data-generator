'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RecipientType, EmailType } from '@/lib/keigo/types';

interface SceneSettingsProps {
  recipient: RecipientType;
  emailType: EmailType;
  tone: number;
  isPro: boolean;
  onRecipientChange: (v: RecipientType) => void;
  onEmailTypeChange: (v: EmailType) => void;
  onToneChange: (v: number) => void;
}

export function SceneSettings({
  recipient,
  emailType,
  tone,
  isPro,
  onRecipientChange,
  onEmailTypeChange,
  onToneChange,
}: SceneSettingsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Step 1: シーン設定</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="recipient">送信相手 *</Label>
          <Select value={recipient} onValueChange={(v) => onRecipientChange(v as RecipientType)}>
            <SelectTrigger id="recipient">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="external">社外（取引先・顧客）— 最も丁寧</SelectItem>
              <SelectItem value="boss">社内上司 — 丁寧</SelectItem>
              <SelectItem value="colleague">社内同僚・後輩 — ややカジュアル敬語</SelectItem>
              <SelectItem value="recruiter">就活（採用担当者）— フォーマル</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="emailType">メールの種類 *</Label>
          <Select value={emailType} onValueChange={(v) => onEmailTypeChange(v as EmailType)}>
            <SelectTrigger id="emailType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thanks">お礼・感謝</SelectItem>
              <SelectItem value="apology">お詫び・謝罪</SelectItem>
              <SelectItem value="request">依頼・お願い</SelectItem>
              <SelectItem value="report">報告・連絡</SelectItem>
              <SelectItem value="inquiry">確認・問い合わせ</SelectItem>
              <SelectItem value="schedule">日程調整</SelectItem>
              <SelectItem value="reminder">催促・リマインド</SelectItem>
              <SelectItem value="decline">お断り・辞退</SelectItem>
              <SelectItem value="greeting">挨拶（着任・異動・退職）</SelectItem>
              <SelectItem value="proposal">見積もり・提案</SelectItem>
              <SelectItem value="invitation">招待・案内</SelectItem>
              <SelectItem value="congratulation">お祝い</SelectItem>
              <SelectItem value="condolence">お悔やみ</SelectItem>
              <SelectItem value="custom">自由入力</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="tone">
            トーン調整
            {!isPro && (
              <span className="ml-2 text-xs text-muted-foreground">（Proプランで利用可）</span>
            )}
          </Label>
          <span className="text-xs text-muted-foreground">
            {tone < 30 ? 'フォーマル' : tone < 70 ? '標準' : 'ソフト'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>フォーマル</span>
          <input
            id="tone"
            type="range"
            min={0}
            max={100}
            step={10}
            value={tone}
            onChange={(e) => onToneChange(Number(e.target.value))}
            disabled={!isPro}
            className="flex-1 accent-primary disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <span>ソフト</span>
        </div>
      </div>
    </div>
  );
}
