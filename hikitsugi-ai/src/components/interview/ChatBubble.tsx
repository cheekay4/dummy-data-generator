'use client'

import { MessageSquare, Mic } from 'lucide-react'
import type { ChatMessage } from '@/lib/types'
import KnowledgeBadge from './KnowledgeBadge'

interface ChatBubbleProps {
  message: ChatMessage
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  if (message.role === 'assistant') {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare size={14} color="white" />
        </div>
        <div className="space-y-2 max-w-[78%]">
          <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm border border-neutral-100">
            <p className="text-sm text-neutral-700 leading-[1.85] whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          {message.extractedKnowledge && (
            <KnowledgeBadge item={message.extractedKnowledge} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-[78%]">
        {message.inputMethod === 'voice_chat' && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-3 h-3 rounded-full bg-white/15 flex items-center justify-center">
              <Mic size={7} color="white" />
            </div>
            <span className="text-[11px] text-white/40">音声入力</span>
          </div>
        )}
        <p className="text-sm leading-[1.85] whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
