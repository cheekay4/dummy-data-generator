"use client";

import { useState, useEffect } from "react";

const SUBSCRIPTION_ID_KEY = "masking_subscription_id";

/**
 * React hook: localStorageのサブスクリプションIDを読んでPro状態を返す。
 * 本番では Supabase + Webhook 連携に置き換える。
 */
export function useSubscription() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(!!localStorage.getItem(SUBSCRIPTION_ID_KEY));
  }, []);

  return { isPro };
}

/** Pro状態の同期チェック（非フック版） */
export function isProUser(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(SUBSCRIPTION_ID_KEY);
}

/** Pro状態をリセット（テスト・ログアウト用） */
export function clearSubscription(): void {
  localStorage.removeItem(SUBSCRIPTION_ID_KEY);
  localStorage.removeItem("masking_customer_id");
}
