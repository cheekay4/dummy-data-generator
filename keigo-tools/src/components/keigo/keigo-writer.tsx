'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SceneSettings } from './scene-settings';
import { ContentInput } from './content-input';
import { ResultDisplay } from './result-display';
import { TemplateChips } from './template-chips';
import { UsageBanner } from './usage-banner';
import {
  canUse,
  getRemainingUses,
  incrementUsage,
  isProUser,
} from '@/lib/keigo/usage';
import type {
  RecipientType,
  EmailType,
  GenerateResult,
  AdjustmentType,
} from '@/lib/keigo/types';

export function KeigoWriter() {
  const [recipient, setRecipient] = useState<RecipientType>('external');
  const [emailType, setEmailType] = useState<EmailType>('thanks');
  const [tone, setTone] = useState(50);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setRemaining(getRemainingUses());
    setIsPro(isProUser());
  }, []);

  const handleTemplateSelect = useCallback(
    (tmplSubject: string, tmplBody: string, tmplRecipient: RecipientType, tmplType: EmailType) => {
      setSubject(tmplSubject);
      setContent(tmplBody);
      setRecipient(tmplRecipient);
      setEmailType(tmplType);
      setResult(null);
      setError(null);
    },
    []
  );

  const generate = useCallback(
    async (adjustment?: AdjustmentType) => {
      if (!content.trim()) {
        setError('本文を入力してください');
        return;
      }
      if (!canUse()) {
        setError('本日の無料枠を使い切りました。Proプランにアップグレードしてください。');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient,
            emailType,
            tone,
            subject,
            content,
            senderName,
            senderCompany,
            recipientName,
            recipientCompany,
            adjustment,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? '生成に失敗しました');
        }

        let parsed: GenerateResult;
        try {
          parsed = JSON.parse(data.result);
        } catch {
          parsed = { subject: subject || '件名', body: data.result, techniques: [] };
        }

        setResult(parsed);
        if (!adjustment) {
          incrementUsage();
          setRemaining(getRemainingUses());
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '生成に失敗しました');
      } finally {
        setIsLoading(false);
      }
    },
    [recipient, emailType, tone, subject, content, senderName, senderCompany, recipientName, recipientCompany]
  );

  const handleAdjust = useCallback(
    (adjustment: AdjustmentType) => {
      generate(adjustment);
    },
    [generate]
  );

  return (
    <div className="space-y-4">
      <UsageBanner remaining={remaining} isPro={isPro} />

      {/* Template chips */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">テンプレートから選ぶ</p>
        <TemplateChips onSelect={handleTemplateSelect} />
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <SceneSettings
            recipient={recipient}
            emailType={emailType}
            tone={tone}
            isPro={isPro}
            onRecipientChange={setRecipient}
            onEmailTypeChange={setEmailType}
            onToneChange={setTone}
          />

          <div className="border-t pt-6">
            <ContentInput
              subject={subject}
              content={content}
              senderName={senderName}
              senderCompany={senderCompany}
              recipientName={recipientName}
              recipientCompany={recipientCompany}
              onSubjectChange={setSubject}
              onContentChange={setContent}
              onSenderNameChange={setSenderName}
              onSenderCompanyChange={setSenderCompany}
              onRecipientNameChange={setRecipientName}
              onRecipientCompanyChange={setRecipientCompany}
            />
          </div>

          {error && (
            <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={() => generate()}
            disabled={isLoading || (!isPro && remaining <= 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              '敬語メールを生成'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <ResultDisplay result={result} onAdjust={handleAdjust} isLoading={isLoading} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
