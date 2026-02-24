"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/common/checkout-button";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  reason?: "limit" | "pro-feature";
}

const PRO_FEATURES = [
  "回数無制限",
  "AI高精度検出モード",
  "ダミーデータ置換（リアルなダミーに自動置換）",
  "カスタムルール登録",
  "一括処理（複数テキスト）",
  "復元機能（マスク⇄元テキスト）",
  "履歴保存（30日間）",
  "全ページ広告なし",
];

export function PaywallModal({ open, onClose, reason = "limit" }: PaywallModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {reason === "limit"
              ? "本日の無料枠を使い切りました"
              : "これはProプランの機能です"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="font-semibold text-sm mb-1">マスキング Pro — 月額190円</p>
            <ul className="space-y-1.5 mt-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✅</span> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <CheckoutButton className="w-full">
              Proプランに申し込む — 月額190円
            </CheckoutButton>
            <Button variant="outline" className="w-full" onClick={onClose}>
              {reason === "limit" ? "明日また無料で使う" : "閉じる"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
