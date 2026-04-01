'use client';

import { CopyButton } from '@/components/ui/CopyButton';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { useDownload } from '@/hooks/useDownload';

interface ExportActionsProps {
  json: string;
}

export function ExportActions({ json }: ExportActionsProps): JSX.Element {
  const download = useDownload();

  return (
    <div className="flex items-center gap-1.5">
      <CopyButton text={json} />
      <Button
        variant="primary"
        size="sm"
        onClick={() => download(json, 'agent-card.json')}
      >
        <Download size={12} />
        <span className="font-mono">.json</span>
      </Button>
    </div>
  );
}
