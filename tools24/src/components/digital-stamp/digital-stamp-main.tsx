'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StampTypeSelector from './stamp-type-selector';
import TextInputPanel from './text-input-panel';
import StyleOptions from './style-options';
import StampPreview from './stamp-preview';
import DownloadPanel from './download-panel';
import { DEFAULT_OPTIONS, type StampOptions } from '@/lib/digital-stamp/stamp-types';

export default function DigitalStampMain() {
  const [options, setOptions] = useState<StampOptions>(DEFAULT_OPTIONS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 設定パネル */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-4 space-y-6">
            <StampTypeSelector value={options.type} onChange={(type) => setOptions({ ...options, type })} />
            <Separator />
            <TextInputPanel options={options} onChange={setOptions} />
            <Separator />
            <StyleOptions options={options} onChange={setOptions} />
          </CardContent>
        </Card>
      </div>

      {/* プレビュー & ダウンロード */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-4">
            <StampPreview options={options} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-4">ダウンロード</p>
            <DownloadPanel options={options} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
