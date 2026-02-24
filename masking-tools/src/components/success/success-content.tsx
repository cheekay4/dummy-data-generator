"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then(({ customerId, subscriptionId, error }) => {
        if (error) {
          setStatus("error");
          return;
        }
        if (subscriptionId) {
          localStorage.setItem("masking_subscription_id", String(subscriptionId));
        }
        if (customerId) {
          localStorage.setItem("masking_customer_id", String(customerId));
        }
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">処理中...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <XCircle className="h-12 w-12 text-destructive mx-auto" />
        <p className="text-destructive font-medium">セッション情報の取得に失敗しました。</p>
        <p className="text-sm text-muted-foreground">
          既にProへの登録が完了している場合はそのままご利用いただけます。
        </p>
        <Button asChild variant="outline">
          <Link href="/pricing">料金ページへ戻る</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-24 text-center space-y-6">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
      <div>
        <h1 className="text-2xl font-bold">Pro登録が完了しました！</h1>
        <p className="text-muted-foreground mt-2">
          マスキングツールが無制限でご利用いただけます。
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/personal-data-masking">ツールに戻る →</Link>
      </Button>
    </div>
  );
}
