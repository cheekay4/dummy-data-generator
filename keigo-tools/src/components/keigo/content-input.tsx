'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface ContentInputProps {
  subject: string;
  content: string;
  senderName: string;
  senderCompany: string;
  recipientName: string;
  recipientCompany: string;
  onSubjectChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onSenderNameChange: (v: string) => void;
  onSenderCompanyChange: (v: string) => void;
  onRecipientNameChange: (v: string) => void;
  onRecipientCompanyChange: (v: string) => void;
}

export function ContentInput({
  subject,
  content,
  senderName,
  senderCompany,
  recipientName,
  recipientCompany,
  onSubjectChange,
  onContentChange,
  onSenderNameChange,
  onSenderCompanyChange,
  onRecipientNameChange,
  onRecipientCompanyChange,
}: ContentInputProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Step 2: 内容入力</h2>

      <div className="space-y-1.5">
        <Label htmlFor="subject">件名（任意・空欄の場合はAIが自動生成）</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="例: 来週の打ち合わせについて"
          maxLength={50}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">
            本文 *
            <span className="ml-1 text-muted-foreground font-normal text-xs">
              （箇条書き・カジュアルな文章でOK）
            </span>
          </Label>
          <span className="text-xs text-muted-foreground">{content.length}文字</span>
        </div>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={8}
          placeholder={`例:\n・来週の打ち合わせの日程を変更したい\n・水曜か木曜の午後がいい\n・場所はオンラインで\n・資料は前日までに送る`}
          className="resize-y"
        />
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="options" className="border rounded-lg px-3">
          <AccordionTrigger className="text-sm font-medium">追加オプション（任意）</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="senderName" className="text-xs">自分の名前（署名用）</Label>
                <Input
                  id="senderName"
                  value={senderName}
                  onChange={(e) => onSenderNameChange(e.target.value)}
                  placeholder="山田 太郎"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="senderCompany" className="text-xs">自分の所属（署名用）</Label>
                <Input
                  id="senderCompany"
                  value={senderCompany}
                  onChange={(e) => onSenderCompanyChange(e.target.value)}
                  placeholder="株式会社〇〇 営業部"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="recipientName" className="text-xs">相手の名前（宛名用）</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => onRecipientNameChange(e.target.value)}
                  placeholder="田中 様"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="recipientCompany" className="text-xs">相手の会社名（宛名用）</Label>
                <Input
                  id="recipientCompany"
                  value={recipientCompany}
                  onChange={(e) => onRecipientCompanyChange(e.target.value)}
                  placeholder="株式会社△△"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
