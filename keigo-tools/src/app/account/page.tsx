'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setLicenseKey('');

    try {
      const res = await fetch(`/api/account?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました');
      } else {
        setLicenseKey(data.licenseKey);
      }
    } catch {
      setError('通信エラーが発生しました。しばらく後でもう一度お試しください');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>ライセンスキーの確認</CardTitle>
          <CardDescription>
            ご登録時のメールアドレスを入力するとライセンスキーを確認できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
              {loading ? '検索中...' : 'ライセンスキーを確認'}
            </Button>
          </form>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {licenseKey && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ライセンスキー:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted rounded-md px-3 py-2 font-mono break-all">
                  {licenseKey}
                </code>
                <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0">
                  {copied ? '✓' : 'コピー'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Chrome拡張の歯車アイコン → ライセンスキーを入力して保存してください
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
