'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Base64Tab } from './base64-tab';
import { UrlEncodeTab } from './url-encode-tab';
import { JwtDecoderTab } from './jwt-decoder-tab';
import { HashGeneratorTab } from './hash-generator-tab';
import { UnicodeConverterTab } from './unicode-converter-tab';

type TabId = 'base64' | 'url' | 'jwt' | 'hash' | 'unicode';

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: 'base64', label: 'Base64', description: 'エンコード/デコード' },
  { id: 'url', label: 'URLエンコード', description: 'エンコード/デコード' },
  { id: 'jwt', label: 'JWTデコーダー', description: 'トークン解析' },
  { id: 'hash', label: 'ハッシュ生成', description: 'MD5 / SHA' },
  { id: 'unicode', label: 'Unicode変換', description: 'コードポイント変換' },
];

export function EncodeDecodeToolkit() {
  const [activeTab, setActiveTab] = useState<TabId>('base64');

  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b pb-2">
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

      {/* Active tab content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {active.label}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              {active.description}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'base64' && <Base64Tab />}
          {activeTab === 'url' && <UrlEncodeTab />}
          {activeTab === 'jwt' && <JwtDecoderTab />}
          {activeTab === 'hash' && <HashGeneratorTab />}
          {activeTab === 'unicode' && <UnicodeConverterTab />}
        </CardContent>
      </Card>
    </div>
  );
}
