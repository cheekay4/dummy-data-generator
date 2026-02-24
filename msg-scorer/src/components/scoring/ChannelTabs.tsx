'use client';
import { motion } from 'framer-motion';
import { Channel } from '@/lib/types';
import { CHANNEL_LABELS } from '@/lib/constants';
import { useScoringStore } from '@/stores/scoring-store';

const channels: Channel[] = ['email-subject', 'email-body', 'line', 'blog-sns'];

export default function ChannelTabs() {
  const { channel, setChannel } = useScoringStore();

  return (
    <div className="bg-stone-100 rounded-xl p-1 inline-flex gap-1 w-full sm:w-auto">
      {channels.map((ch) => (
        <button
          key={ch}
          onClick={() => setChannel(ch)}
          className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none justify-center"
          style={{ color: channel === ch ? '#1C1917' : '#78716C' }}
        >
          {channel === ch && (
            <motion.span
              layoutId="channel-indicator"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{CHANNEL_LABELS[ch].icon}</span>
          <span className="relative z-10">{CHANNEL_LABELS[ch].name}</span>
        </button>
      ))}
    </div>
  );
}
