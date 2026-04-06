'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface DirectionToggleProps {
  direction: 'toHalf' | 'toFull';
  onChange: (direction: 'toHalf' | 'toFull') => void;
}

export default function DirectionToggle({ direction, onChange }: DirectionToggleProps) {
  return (
    <div className="flex gap-3">
      <Button
        variant={direction === 'toHalf' ? 'default' : 'outline'}
        className="flex-1 h-14 text-base"
        onClick={() => onChange('toHalf')}
      >
        全角
        <ArrowRight className="mx-2 h-4 w-4" />
        半角
      </Button>
      <Button
        variant={direction === 'toFull' ? 'default' : 'outline'}
        className="flex-1 h-14 text-base"
        onClick={() => onChange('toFull')}
      >
        半角
        <ArrowRight className="mx-2 h-4 w-4" />
        全角
      </Button>
    </div>
  );
}
